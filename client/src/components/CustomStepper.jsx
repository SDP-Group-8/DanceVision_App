import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box
} from '@chakra-ui/react'

const CustomStepper = ({stepIndex}) => {
  const steps = [
    { title: 'Select A Dance'},
    { title: 'Practice'},
    { title: 'View Results'},
  ]

  const { activeStep } = useSteps({
    index: stepIndex,
    count: steps.length,
  })

  return (
    <Stepper size={'md'} colorScheme='pink' index={activeStep}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber color='white'/>}
              active={<StepNumber color='white'/>}
            />
          </StepIndicator>

          <Box flexShrink='0'>
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  )

}

export default CustomStepper