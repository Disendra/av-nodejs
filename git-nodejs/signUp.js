// routes.js
const express = require('express')
const db = require('./dbConnection')

const router = express.Router()


router.post('/insertData', (req, res) => {
  const { emailId, password, role } = req.body
  const createdDate = new Date()

  const data = { emailId, password, role, createdDate }

  const sql = 'INSERT INTO login_Data SET ?'

  db.query(sql, data, (err, result) => {
    if (err) {
      // Check if the error is due to duplicate entry
      if (err.code === 'ER_DUP_ENTRY') {
        return res
          .status(400)
          .send({
            status: false,
            message: 'User with this email already exists'
          })
      } else {
        return res.status(500).send({ status: false, message: err.message })
      }
    } else {
      return res.send({ status: true, message: 'User created Successfully' })
    }
  })
})

router.post('/login', (req, res) => {
  const { emailId, password } = req.body

  if (!emailId || !password) {
    return res.status(400).send({ message: 'Email and password are required' })
  }

  const sqlSelect = 'SELECT emailId, password FROM login_Data WHERE emailId = ?'
  const sqlInsert =
    'INSERT INTO login_Logs (emailId, login_time) VALUES (?, NOW())'

  db.query(sqlSelect, [emailId], (err, result) => {
    if (err) {
      return res.status(500).send({ message: err.message })
    } else {
      if (result.length === 0) {
        return res
          .status(404)
          .send({ status: false, message: 'User not found' })
      } else {
        const user = result[0]
        if (user.password !== password) {
          return res
            .status(401)
            .send({ status: false, message: 'Invalid password' })
        } else {
          // User authenticated, insert login details
          db.query(sqlInsert, [emailId], (errInsert, resultInsert) => {
            if (errInsert) {
              return res.status(500).send({ message: errInsert.message })
            } else {
              res.send({ status: true, message: 'Login Successful' })
            }
          })
        }
      }
    }
  })
})

function handleQuery(sql, res) {
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ status: false, message: err.message });
    } else {
      return res.send({
        status: true,
        records: result,
        message: 'Details Fetched Successfully'
      });
    }
  });
}

router.get('/getLoginData', (req, res) => {
  const sql = 'SELECT * FROM login_Data';
  handleQuery(sql, res);
});

router.get('/loginInfo', (req, res) => {
  const sql = 'SELECT * FROM login_Logs';
  handleQuery(sql, res);
});



module.exports = router
