import { Input as MantineInput } from '@mantine/core'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { FormikProps } from 'formik'
import { useEffect } from 'react'

type RichTextEditorInputProps = {
  name: string
  label: string
  required?: boolean
  formik: FormikProps<any>
}

export const RichTextEditorInput = ({ name, label, required, formik }: RichTextEditorInputProps) => {
  const value = formik.values[name] || ''
  const error = formik.touched[name] && formik.errors[name] ? String(formik.errors[name]) : undefined

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      formik.setFieldValue(name, html === '<p></p>' ? '' : html)
    },
  })

  // This effect synchronizes the editor's content with the form's value from outside,
  // but only if the editor is not currently focused by the user.
  // This prevents overwriting user's input during an external state update (e.g., form reset).
  useEffect(() => {
    const isFocused = editor?.isFocused
    const content = editor?.getHTML()

    if (isFocused || !editor || value === content) {
      return
    }

    editor.commands.setContent(value || '')
  }, [value, editor])

  return (
    <MantineInput.Wrapper label={label} required={required} error={error}>
      <RichTextEditor editor={editor} onClick={() => editor?.commands.focus()}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content style={{ minHeight: 200, cursor: 'text' }} />
      </RichTextEditor>
      {error && <MantineInput.Error>{error}</MantineInput.Error>}
    </MantineInput.Wrapper>
  )
}
