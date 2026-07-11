export default function EmptyStateSteps({
  className = '',
  defaultDescriptionClassName = '',
  defaultStepClassName = '',
  defaultTitleClassName = '',
  descriptionClassNames = [],
  stepClassNames = [],
  steps = [],
  titleClassNames = [],
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {steps.map((step, index) => (
        <div
          key={step.key || `${step.title}-${index}`}
          className={stepClassNames[index] || defaultStepClassName}
        >
          <p className={titleClassNames[index] || defaultTitleClassName}>{step.title}</p>
          <p className={descriptionClassNames[index] || defaultDescriptionClassName}>
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
