#!/usr/bin/env python


import json

import pika


def callback(channel, method, properties, body):
	data = json.loads(body.decode())
	print(data['timestamp'], data['instance_id'], data['value'], sep=": ")
	channel.basic_ack(delivery_tag=method.delivery_tag)


if __name__ == '__main__':
	with open('../config.json') as f:
		config = json.load(f)
	connection = pika.BlockingConnection(pika.ConnectionParameters(config['rabbitmq_host']))
	channel = connection.channel()
	channel.queue_declare(queue=config['rabbitmq_channel'])
	channel.basic_consume(queue=config['rabbitmq_channel'], on_message_callback=callback)

	print("press Ctrl+C to stop")
	try:
		channel.start_consuming()
	except KeyboardInterrupt:
		print("exiting")
