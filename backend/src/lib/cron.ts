import { CronJob } from 'cron'
import { notifyAboutMostLikedIdeas } from '../scripts/notifyAboutMostLikedIdeas.js'
import type { AppContext } from './ctx.js'
import { logger } from './logger.js'

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '0 10 1 * *', // At 10:00 on day-of-month 1
    () => {
      notifyAboutMostLikedIdeas({ ctx }).catch((error) => {
        logger.error('cron', error)
      })
    },
    null, // onComplete
    true // start right now
  )
}
