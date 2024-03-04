const express = require('express')
const app = express()
const port = 5000

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isPrime(num){
    for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return num > 1;
}

app.get('/', (req,res) => {
    res.send("Hello World! test 1234 ");
})

app.get('/getcode', (req,res)=> {
    res.send("Paul Moddieb Usul!!!")
})

app.get('/plus/:num1/:num2', (req,res) => {
    try {
        if(isNaN(req.params.num1) || isNaN(req.params.num2)) {
            throw new Error("Error")
        }
        res.status(200).send((parseFloat(req.params.num1) + parseFloat(req.params.num2)).toString());
    } catch(err) {
        res.status(400).send("Bad Request")
    }
})

app.get('/is_prime/:num1', (req,res) => {
    try {
        const number = parseFloat(req.params.num1)

        if(isNaN(req.params.num1)) {
            return res.status(200).send(false)
        }

        if(isFloat(number))
        {
            return res.status(200).send(false)
        }

        if(!isPrime(number))
        {
            return res.status(200).send(false)
        }
        res.status(200).send(true)
    } catch(err) {
        res.status(400).send("Don't Care")
    }
})

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = server