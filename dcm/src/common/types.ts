// global types for the app because we're using typescript

// interface for User
export interface User {
  username: string
  passwordHash: string
  serialNumber: string
  modes: {
    VOO: {
      ventricularAmplitude: number
      ventricularPulseWidth: number
      ventricularRefractoryPeriod: number
      lowerRateLimit: number
    }
    AOO: {
      atrialAmplitude: number
      atrialPulseWidth: number
      atrialRefractoryPeriod: number
      lowerRateLimit: number
    }
    VVI: {
      ventricularAmplitude: number
      ventricularPulseWidth: number
      ventricularRefractoryPeriod: number
      lowerRateLimit: number
    }
    AAI: {
      atrialAmplitude: number
      atrialPulseWidth: number
      atrialRefractoryPeriod: number
      lowerRateLimit: number
    }
  }
  lastUsedMode?: 'VOO' | 'AOO' | 'VVI' | 'AAI' | 'OFF'
}

// function for creating a default User object
export const createUser = (overrides: Partial<User> = {}): User =>
  ({
    username: '',
    passwordHash: '',
    serialNumber: '',
    modes: {
      VOO: {
        ventricularAmplitude: 0,
        ventricularPulseWidth: 0,
        ventricularRefractoryPeriod: 0,
        lowerRateLimit: 0,
      },
      AOO: {
        atrialAmplitude: 0,
        atrialPulseWidth: 0,
        atrialRefractoryPeriod: 0,
        lowerRateLimit: 0,
      },
      VVI: {
        ventricularAmplitude: 0,
        ventricularPulseWidth: 0,
        ventricularRefractoryPeriod: 0,
        lowerRateLimit: 0,
      },
      AAI: {
        atrialAmplitude: 0,
        atrialPulseWidth: 0,
        atrialRefractoryPeriod: 0,
        lowerRateLimit: 0,
      },
    },
    lastUsedMode: 'OFF',
    ...overrides,
  }) as User

// interface for PublicUser
// - contains only username, serialNumber, and lastUsedMode
// - other information must be kept private until requested
export interface PublicUser {
  username: string
  serialNumber: string
  lastUsedMode?: 'VOO' | 'AOO' | 'VVI' | 'AAI' | 'OFF'
}

// interface for RegisterUserResponse
// - currently not any different from other responses but
//   here for flexibility in the future
export interface RegisterUserResponse {
  success: boolean
  message?: string
}

// interface for SetUserResponse
// - currently not any different from other responses but
//   here for flexibility in the future
export interface SetUserResponse {
  success: boolean
  message?: string
}

// interface for LoginUserResponse
// - currently not any different from other responses but
//   here for flexibility in the future
export interface LoginUserResponse {
  success: boolean
  user?: PublicUser
  message?: string
}

// interface for ModeSettingResponse
// - returns success, settings, and message
// - settings is a record of strings to numbers for the settings
//   for a mode
export interface ModeSettingResponse {
  success: boolean
  settings?: Record<string, number>
  message?: string
}

// interface for Toast
// - id is a unique identifier for the toast
// - message is the message to display
// - type is the type of toast'
// - removing is a boolean to indicate if the toast is being removed
export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  removing?: boolean
}

// interface for ChartPoint
export interface ChartPoint {
  x: number
  y: number
}
