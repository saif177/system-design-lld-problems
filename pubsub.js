class Message {
    constructor(content) {
        this.content = content;
        this.timestamp = Date.now();
    }
}

class Topic {
    constructor(name) {
        this.name = name;
        this.messages = [];
        this.subscribers = new Map(); // subscriberId -> offset
    }

    addMessage(message) {
        this.messages.push(message);
        this.notifySubscribers();
    }

    subscribe(subscriber) {
        // New subscriber starts at current message count
        this.subscribers.set(subscriber.id, this.messages.length);
    }

    notifySubscribers() {
        for (let [subscriberId, offset] of this.subscribers.entries()) {
            const subscriber = Subscriber.registry.get(subscriberId);
            if (!subscriber) continue;

            const newMessages = this.messages.slice(offset);
            newMessages.forEach(msg => {
                subscriber.receive(this.name, msg);
            });

            // Update offset
            this.subscribers.set(subscriberId, this.messages.length);
        }
    }

 
}

class Broker {
    constructor() {
        this.topics = new Map();
    }

    createTopic(name) {
        const topic = new Topic(name);
        this.topics.set(name, topic);
        return topic;
    }

    publish(topicName, content) {
        const topic = this.topics.get(topicName);
        if (!topic) {
            console.error(`Topic ${topicName} does not exist.`);
            return;
        }
        const message = new Message(content);
        topic.addMessage(message);
    }

    subscribe(topicName, subscriber) {
        const topic = this.topics.get(topicName);
        if (!topic) {
            console.error(`Topic ${topicName} does not exist.`);
            return;
        }
        topic.subscribe(subscriber);
    }

    // getData(topc, subscriber) {
    //     const topic = this.topics.get(topc);
    //     return topic.getMsgCount(subscriber);
    // }
}

class Subscriber {
    static registry = new Map();

    constructor(id) {
        this.id = id;
        Subscriber.registry.set(id, this);
    }

    receive(topicName, message) {
        console.log(`[${this.id}] received from ${topicName}: ${message.content}`);
    }
}



const broker = new Broker();

broker.createTopic("tech");
broker.createTopic("sports");

const alice = new Subscriber("alice");
const bob = new Subscriber("bob");

broker.publish("tech", "JavaScript LLD is fun!");
broker.publish("sports", "Ronaldo scored a hat trick!");

broker.subscribe("tech", alice);
broker.subscribe("sports", bob);

// These messages will be received after subscription
broker.publish("tech", "Node.js cluster mode explained");
broker.publish("sports", "India wins the match!");

//broker.getData('tech', alice)