import * as React from 'react'
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

export const Collapsible = CollapsiblePrimitive.Root
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger
export const CollapsibleContent = React.forwardRef(function Content(props, ref) {
  return <CollapsiblePrimitive.Content ref={ref} {...props} />
})
