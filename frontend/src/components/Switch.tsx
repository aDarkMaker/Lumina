interface SwitchProps {
	checked?: boolean
	onChange?: (checked: boolean) => void
	disabled?: boolean
	'aria-label'?: string
}

export function Switch({
	checked = false,
	onChange,
	disabled = false,
	'aria-label': ariaLabel = '开关',
}: SwitchProps) {
	return (
		<label className="switch">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange?.(e.target.checked)}
				disabled={disabled}
				aria-label={ariaLabel}
			/>
			<span className="slider" />
		</label>
	)
}
