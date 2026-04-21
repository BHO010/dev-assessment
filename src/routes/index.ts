import { Router } from 'express'
import commonStudentsRouter from './commonstudents'
import healthRouter from './health'
import registerRouter from './register'
import retrieveForNotificationsRouter from './retrievefornotifications'
import suspendRouter from './suspend'

const router = Router()

router.use('/health', healthRouter)
router.use('/register', registerRouter)
router.use('/commonstudents', commonStudentsRouter)
router.use('/suspend', suspendRouter)
router.use('/retrievefornotifications', retrieveForNotificationsRouter)

export default router
