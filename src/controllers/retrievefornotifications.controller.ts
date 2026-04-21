import { NextFunction, Request, Response } from 'express'
import { RetrieveForNotificationsBody } from '../schemas/retrievefornotifications.schema'
import { getRecipientsForNotification } from '../services/retrievefornotifications.service'

export async function retrieveForNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { teacher, notification } = req.body as RetrieveForNotificationsBody
    const recipients = await getRecipientsForNotification(teacher, notification)
    res.json({ recipients })
  } catch (err) {
    next(err)
  }
}
