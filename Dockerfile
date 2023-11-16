FROM rabbitmq:3-management

WORKDIR /

COPY ./configs/rabbitmq/rabbitmq.conf ./etc/rabbitmq/rabbitmq.conf
COPY ./configs/rabbitmq/definitions.json ./etc/rabbitmq/definitions.json

RUN rabbitmq-plugins enable rabbitmq_management
