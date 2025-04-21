class User {
    constructor(name) {
        this.id = crypto.randomUUID();
        this.name = name;
    }
}

class Doc {
    constructor(owner, content = "") {
        this.id = crypto.randomUUID();
        this.owner = owner;
        this.content = content;
        this.sharedWith = new Map();
    } 

    isOwner(user) {
        return this.owner.id === user.id;
    }

    canRead(user) {
        return this.isOwner(user) || !!this.sharedWith.get(user.id)?.includes('read');
    }

    read(user) {
        if(this.canRead(user)) {
            return console.log(`Content : ${this.content}`);
        } else {
            return console.log(`Access denied: You don't have access`);
        }
    }

    write(user, newContent) {
        if(this.isOwner(user)) {
            this.content = newContent;
            console.log('content update successfully');
        } else {
            console.log('Access denied: only owner can write')
        }
    }

    share(user, targetUser) {
        if(this.isOwner(user)) {
            this.sharedWith.set(targetUser.id, 'read');
            console.log('read access has been given');
        } else {
            throw new Error('Access denied');
        }
    }
}

const user1 = new User("Alice");
const user2 = new User("Bot");

const doc = new Doc(user1, "this is new doc1");
doc.read(user2);
doc.read(user1);
doc.share(user2, user1);
doc.read(user1);

doc.read(user2);
