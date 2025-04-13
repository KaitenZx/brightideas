import { zNickRequired, zStringMin, zStringRequired } from '@brightideas/shared'
import sanitizeHtml from 'sanitize-html'
import { z } from 'zod'

// Configure sanitize-html to allow basic formatting tags and links
const sanitizeConfig: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'br', 'a'],
  allowedAttributes: {
    a: ['href'],
  },
  // Disallow common XSS vectors
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: false,
  enforceHtmlBoundary: true,
}

export const zCreateIdeaTrpcInput = z.object({
  name: zStringRequired,
  nick: zNickRequired,
  description: zStringRequired,
  text: zStringMin(100).transform((value) => sanitizeHtml(value, sanitizeConfig)),
  images: z.array(zStringRequired),
  certificate: z.string().nullable(),
  documents: z.array(zStringRequired),
})
