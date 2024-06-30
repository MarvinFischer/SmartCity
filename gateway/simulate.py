#!/usr/bin/env python


import json
import math
import random
import time

import pika
import requests


class ApiWeatherGovAccess:
	"""A simple API client that accesses https://api.weather.gov"""

	HEADERS = {'User-Agent': "study project of Felix Klenk, st149186@stud.uni-stuttgart.de"}

	def __init__(self, type_id, instance_id, station_id, **kwargs):
		self.type_id = type_id
		self.instance_id = instance_id
		self.url = "https://api.weather.gov/stations/{}/observations/latest".format(station_id)
		self.cached_headers = None
		self.cached_body = None
		self.ttl = 0
	
	def sense(self):
		time_curr = time.time_ns()
		if self.ttl <= 0:
			self.cached_response = requests.get(self.url, headers=ApiWeatherGovAccess.HEADERS)
			self.cached_response.raise_for_status()
			for directive in (s.strip() for s in self.cached_response.headers['Cache-Control'].split(',')):
				if directive.startswith('max-age='):
					self.ttl = int(directive[8:]) * 1_000_000_000
					break
		else:
			self.ttl -= time_curr - self.time_prev
		self.time_prev = time_curr
		return {
			'celsius': self.cached_response.json()['properties']['temperature']['value'],
			'percent': self.cached_response.json()['properties']['relativeHumidity']['value']
		}


class NormallyDistributedDeltaSensor:
	"""A simulated sensor whose delta is normally distributed.

	Every time this sensor is polled, its current value is changed by a random delta
	and clamped to be between val_min and val_max.
	"""

	__slots__ = ('type_id', 'instance_id', 'unit', 'val_min', 'val_max', 'val_curr', 'sigma')

	def __init__(self, type_id, instance_id, unit, val_min, val_max, val_init, variance, **kwargs):
		self.type_id = type_id
		self.instance_id = instance_id
		self.unit = unit
		self.val_min = val_min
		self.val_max = val_max
		self.val_curr = val_init
		self.sigma = math.sqrt(variance)
	
	def sense(self):
		self.val_curr = max(self.val_min, min(self.val_curr + random.gauss(mu=0.0, sigma=self.sigma), self.val_max))
		return {self.unit: self.val_curr}


silly_dict = {  # Why doesn't __dict__ work?
	'ApiWeatherGovAccess': ApiWeatherGovAccess,
	'NormallyDistributedDeltaSensor': NormallyDistributedDeltaSensor,
}

if __name__ == '__main__':
	with open('../config.json') as f:
		config = json.load(f)

	sensors = [silly_dict[conf_sensor['impl']](**conf_sensor) for conf_sensor in config['sensors']]
	print("There are", len(sensors), "sensors (out of 4 required).")
	
	conn = pika.BlockingConnection(pika.ConnectionParameters(host=config['rabbitmq_host'], port=config['rabbitmq_port'], credentials=pika.PlainCredentials(config['rabbitmq_user'], config['rabbitmq_password'])))
	channel = conn.channel()
	channel.queue_declare(queue=config['rabbitmq_channel'])

	print("press Ctrl+C to stop")
	try:
		while True:
			for sensor in sensors:
				channel.basic_publish(exchange='', routing_key=config['rabbitmq_channel'], body=json.dumps({
					'timestamp': time.time_ns(),
					'type_id': sensor.type_id,
					'instance_id': sensor.instance_id,
					'value': sensor.sense(),
				}))
			time.sleep(config['poll_delay'])
	except KeyboardInterrupt:
		print("exiting")
