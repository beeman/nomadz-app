import { resolveUrl } from '@/utils/app.utils'
import { HttpStatusCode } from 'axios'
import { atom } from 'jotai'
import { ActionCreatorOptions } from '../types/action.types'
import { Event } from '../types/event.types'
import { api } from '../utils/api'

// Atom for storing fetched events
export const eventsAtom = atom<Event[]>([])
export const cachedEventsAtom = atom<Event[]>([])
export const selectedEventAtom = atom<Event | null>(null)

// Atom to fetch a single event by ID
export const fetchEventAtom = atom(
  (get) => get(selectedEventAtom),
  async (_, set, eventId: string, options?: ActionCreatorOptions) => {
    try {
      const response = await api.get(`events/${eventId}`)

      if (response.status === HttpStatusCode.Ok) {
        set(selectedEventAtom, response.data)
      }
    } catch (error) {
      options?.onError?.(error)
    }
  },
)

// Atom for fetching events
export const fetchEventsAtom = atom(
  (get) => get(eventsAtom),
  async (get, set, options?: ActionCreatorOptions) => {
    try {
      const url = resolveUrl('events', {
        include: {
          eventType: true,
        },
        orderBy: {
          startDate: 'asc',
        },
        where: {
          startDate: {
            gte: new Date().toISOString(),
          },
        },
      })

      const response = await api.get(url)

      if (response.status === HttpStatusCode.Ok) {
        set(eventsAtom, response.data)
        options?.onSuccess?.(response.data)
      }
    } catch (error: any) {
      options?.onError?.(error)
    }
  },
)

// Atom for fetching cached events
export const fetchCachedEventsAtom = atom(
  (get) => get(cachedEventsAtom),
  async (get, set, options?: ActionCreatorOptions) => {
    try {
      const response = await api.get('/events/cached?maxHotelsPerEvent=3')

      if (response.status === HttpStatusCode.Ok) {
        const now = new Date().toISOString()

        const filteredAndSorted = response.data
          .filter((event: any) => event.endDate >= now)
          .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

        set(cachedEventsAtom, filteredAndSorted)
        options?.onSuccess?.(filteredAndSorted)
      }
    } catch (error: any) {
      options?.onError?.(error)
    }
  },
)
