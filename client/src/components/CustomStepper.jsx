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
  Stack,
  Text,
  Box,
} from '@chakra-ui/react'

const CustomStepper = ({stepIndex, color='white'}) => {
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
    <Stack>
      <Stepper colorScheme='pink' size='sm' index={activeStep} gap='0'>
        {steps.map((step, index) => (
          <Step key={index} gap='0'>
            <StepIndicator >
              <StepStatus complete={<StepIcon />} />
            </StepIndicator>
            <StepSeparator _horizontal={{ ml: '0' }} />
          </Step>
        ))}
      </Stepper>
      <Text color={'pink.500'}>
        <b>{steps[activeStep].title}</b>
      </Text>
    </Stack>
  )

}

export default CustomStepper