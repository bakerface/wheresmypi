# wheresmypi
**Locate your Raspberry Pi**

Give your Raspberry Pi a name, like `mike`, and create the following script:

```
$ nano /opt/update-ip.sh

IP_ADDRESS=`hostname -I`

NAME="mike"
URL="http%3A%2F%2F$IP_ADDRESS"

curl -X POST https://wheresmypi.herokuapp.com?$NAME=$URL
```

Make the script executable:

```
$ chmod +x /opt/update-ip.sh
```

Run the script once an hour via cron:

```
$ crontab -e

0 * * * * /opt/update-ip.sh
```

Then go to https://wheresmypi.herokuapp.com/mike
