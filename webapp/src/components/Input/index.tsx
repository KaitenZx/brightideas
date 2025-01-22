/* eslint-disable @typescript-eslint/no-explicit-any */
import cn from 'classnames'
import type { FormikProps } from "formik"
import css from './index.module.css'

export const Input = <TValues extends Record<string, any>>({
	name,
	label,
	formik,
	maxWidth
}: {
	name: string
	label: string
	formik: FormikProps<TValues>
	maxWidth?: number
}) => {

	const value = formik.values[name]
	const error = formik.errors[name] as string | undefined
	const touched = formik.touched[name]
	const invalid = !!touched && !!error
	const disabled = formik.isSubmitting


	return (
		<div className={cn({ [css.field]: true, [css.disabled]: disabled })}>
			<label className={css.label} htmlFor={name}>
				{label}
			</label>
			<input
				className={cn({
					[css.input]: true,
					[css.invalid]: invalid,
				})}
				style={{ maxWidth }}
				type="text"
				onChange={(e) => {
					void formik.setFieldValue(name, e.target.value)
				}}
				onBlur={() => {
					void formik.setFieldTouched(name)
				}}
				value={value}
				name={name}
				id={name}
			/>
			{invalid && <div className={css.error}>{error}</div>}
		</div>
	)
}