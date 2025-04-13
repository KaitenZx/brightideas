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
  formik: FormikProps<any> // Accept formik instance as prop
}

export const RichTextEditorInput = ({ name, label, required, formik }: RichTextEditorInputProps) => {
  const value = formik.values[name] || ''
  const error = formik.touched[name] && formik.errors[name] ? String(formik.errors[name]) : undefined

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      // Add other extensions like Placeholder if needed
    ],
    content: value, // Initialize with the formik value
    onUpdate({ editor }) {
      const html = editor.getHTML()
      // Send empty string if editor contains only an empty paragraph to satisfy min length validation
      formik.setFieldValue(name, html === '<p></p>' ? '' : html)
    },
  })

  // Effect to update editor content if the formik value changes externally
  // (e.g., after loading data in EditIdeaPage or form reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Use setTimeout to avoid race conditions with editor initialization/updates
      setTimeout(() => {
        editor.commands.setContent(value || '<p></p>') // Set to empty paragraph if value is empty
      }, 0)
    }
    // Only run this effect if the formik value changes
    // Avoid dependency on 'editor' to prevent potential loops if editor updates trigger rerenders
  }, [value, name, editor, formik.setFieldValue]) // Use formik.setFieldValue in deps

  return (
    <MantineInput.Wrapper label={label} required={required} error={error}>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          {/* Keep the same toolbar controls */}
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

        <RichTextEditor.Content style={{ minHeight: 200 }} />
      </RichTextEditor>
      {/* Display error message manually */}
      {error && <MantineInput.Error>{error}</MantineInput.Error>}
    </MantineInput.Wrapper>
  )
}
