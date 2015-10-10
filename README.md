# MsgTransferServer
Message Queue Node.js Server

msgget.js is used to get messages from client and push the message to redis ;
msgstat.js is used to get a list's status in redis(
  There are 3 kind of status of list:
    order(which means this task is still in order);
    working(which means someone is just woking with this task);
    done(which means the task has been done)
) ;
msgstatchange.js is used to change a list's status;
