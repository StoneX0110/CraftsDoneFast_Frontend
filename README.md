# Prerequisistes
It is assumed that npm with the including node.js is already installed at the machine. 
# Installing

Clone Git repository
```
git clone https://gitlab.lrz.de/seba-master-2022/team-45/frontend.git
```

Install dependencies
```
npm install --force //due to an outdated package regarding the chat library
```

# Start React

```
npm start
```

# Disable CORS errors
The search of offers can be dependent on API calls, if the distance of provider and customer should be taken into account. Being able to access this external API, a CORS error appears, therefore once a session https://cors-anywhere.herokuapp.com/corsdemo has to be accessed and the 'request temporary access to the demo server' button clicked. Nevertheless, keep in mind, that the free API is due to a demo version limited to 10 calls each hour (https://www.zipcodeapi.com/Plans). 
