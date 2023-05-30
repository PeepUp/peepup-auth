import {
   Consumer,
   ConsumerConfig,
   Kafka,
   Message,
   Producer,
   ProducerBatch,
   TopicMessages,
   logLevel,
} from "kafkajs";

export class KafkaService {
   private kafka: Kafka;
   private consumer: Consumer;
   private producer: Producer;

   constructor() {
      this.kafka = new Kafka({
         clientId: "see-server",
         brokers: ["127.0.0.1:9092"],
         logLevel: logLevel.INFO,
         retry: {
            initialRetryTime: 2500,
            retries: 10,
         },
      });
      const consumerConfig: ConsumerConfig = {
         groupId: "get-file-consumer-group",
         maxWaitTimeInMs: 5000,
         sessionTimeout: 30000,
         maxBytesPerPartition: 1000000, // 1MB
         rebalanceTimeout: 30000,
      };

      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer(consumerConfig);
   }

   public async init(): Promise<void> {
      console.log("connecting consumer && producer kafka!");
      await this.consumer.connect();
      await this.producer.connect();
   }

   public async shutdown(): Promise<void> {
      console.log("disconnecting consumer && producer kafka!");
      await this.consumer.disconnect();
      await this.producer.disconnect();
   }

   public async sendBatch(
      topic: string,
      messages: Array<object>
   ): Promise<void> {
      const kafkaMessages: Array<Message> = messages.map((message) => {
         return {
            value: JSON.stringify(message),
         };
      });

      const topicMessages: TopicMessages = {
         topic: topic,
         messages: kafkaMessages,
      };

      const batch: ProducerBatch = {
         topicMessages: [topicMessages],
      };

      await this.producer.sendBatch(batch);
   }

   public async sendMessage(topic: string, message: string): Promise<void> {
      await this.producer.send({
         topic,
         messages: [{ value: message }],
      });
   }

   public async processMessage(messageData: string): Promise<void> {
      try {
         const message = JSON.parse(messageData);
         console.log(message);
         return message;
      } catch (error) {
         console.error("Failed to parse message data:", error);
      }
   }

   public async consumeMessage(topic: string): Promise<any> {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      await this.consumer.run({
         eachMessage: async ({ topic, partition, message }) => {
            const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
            const messageData = message.value?.toString();

            if (messageData) {
               await this.processMessage(messageData);
            }
         },

         /* eachBatch: async (eachBatchPayload: EachBatchPayload) => {
				const { batch } = eachBatchPayload;
				for (const message of batch.messages) {
					const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`;
				}

				return await callback(batch.messages);
			}, */
      });
   }
}
