// import UserRouter from "./app/routes/UserRouter.js"
// import EnrollmentRouter from "./app/routes/EnrollmentRouter.js";
// import MemberRouter from "./app/routes/MemberRouters.js";
// import CheckingPeriodRouter from "./app/routes/CheckingPeriodRouter.js";
// import TransactionRouter from "./app/routes/TransactionRouter.js";
// import IncomeRouter from "./app/routes/IncomeRouter.js";
// import ExpenditureRouter from "./app/routes/ExpenditureRouter.js";

const express = require('express')
const db = require('./app/config/database.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const pdf = require('express-pdf')
const UserRouter = require('./app/routes/UserRouter.js')
const ExpenditureRouter = require('./app/routes/ExpenditureRouter.js')
const EnrollmentRouter = require('./app/routes/EnrollmentRouter.js')
const MemberRouter = require('./app/routes/MemberRouters.js')
const CheckingPeriodRouter = require('./app/routes/CheckingPeriodRouter.js')
const TransactionRouter = require('./app/routes/TransactionRouter.js')
const IncomeRouter = require('./app/routes/IncomeRouter.js')
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express()

try {
  const dbAuth = async () => {
    await db.authenticate()
    console.log('Database berhasil di conect')
  }
  dbAuth()
} catch (error) {
  console.log('Conection Error :  ', error)
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(cookieParser())
app.use(express.json())
app.use(pdf)
app.use('/users', UserRouter)
app.use('/enrollments', EnrollmentRouter)
app.use('/members', MemberRouter)
app.use('/checkingPeriods', CheckingPeriodRouter)
app.use('/transactios', TransactionRouter)
app.use('/income', IncomeRouter)
app.use('/expenditure', ExpenditureRouter)





app.listen(PORT, () => console.log(`Server is conected  ${PORT}`))