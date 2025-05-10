import React, { ReactNode, Suspense } from 'react'

const CreateAccountFormLayout = ({ children } : { children: ReactNode }) => {
  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

export default CreateAccountFormLayout
