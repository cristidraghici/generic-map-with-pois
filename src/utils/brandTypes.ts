import { RecordId } from '@/types'

// Utility function to cast a string to RecordId type
export const toRecordId = (id: string): RecordId => id as RecordId
