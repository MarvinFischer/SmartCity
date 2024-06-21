#!/usr/bin/env python


import json
import math
import random
import time

import pika


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
		return self.val_curr


silly_dict = {  # Why doesn't __dict__ work?
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
					'value': {
						sensor.unit: sensor.sense(),
					},
				}))
			time.sleep(config['poll_delay'])
	except KeyboardInterrupt:
		print("exiting")
