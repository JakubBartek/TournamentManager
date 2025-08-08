import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams } from 'react-router-dom'
import {
  useMessages,
  useMessageCreate,
  useMessageUpdate,
  useMessageDelete,
} from '@/hooks/useMessage'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Message, MessageType } from '@/types/message'
import { useTournamentAuth } from '@/components/Auth/TournamentAuthContext'
import { useNavigate } from 'react-router-dom'

export default function EditMessages() {
  const { t } = useTranslation()
  const { tournamentId } = useParams<{ tournamentId: string }>()
  const { data: messages, isLoading, error } = useMessages(tournamentId ?? '')
  const createMessage = useMessageCreate()
  const updateMessage = useMessageUpdate()
  const deleteMessage = useMessageDelete()
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<MessageType>(MessageType.INFO)
  const [newPriority, setNewPriority] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editType, setEditType] = useState<MessageType>(MessageType.INFO)
  const [editPriority, setEditPriority] = useState(1)
  const [open, setOpen] = useState(false)
  const { isAuthenticated } = useTournamentAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated(tournamentId ?? '')) {
      navigate(`/${tournamentId}/enter-password`)
    }
  }, [isAuthenticated, navigate, tournamentId])

  if (!isAuthenticated(tournamentId ?? '')) return null

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent) return
    createMessage.mutate({
      tournamentId: tournamentId ?? '',
      content: newContent,
      type: newType,
      priority: newPriority,
    })
    setNewContent('')
    setNewType(MessageType.INFO)
    setNewPriority(1)
    setOpen(false)
  }

  const startEdit = (msg: Message) => {
    setEditingId(msg.id)
    setEditContent(msg.content)
    setEditType(msg.type)
    setEditPriority(msg.priority)
  }

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    updateMessage.mutate({
      id: editingId,
      tournamentId: tournamentId ?? '',
      content: editContent,
      type: editType,
      priority: editPriority,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setEditingId(null)
    setEditContent('')
    setEditType(MessageType.INFO)
    setEditPriority(1)
  }

  const handleDelete = (id: string) => {
    deleteMessage.mutate({ tournamentId: tournamentId ?? '', id })
  }

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <h2 className='text-2xl font-bold mb-6'>{t('edit_messages')}</h2>
      <Card className='w-full mb-6'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <CardContent className='cursor-pointer flex justify-center items-center'>
              <FontAwesomeIcon
                icon={faPlus}
                className='text-3xl font-bold text-[#646cff]'
              />
            </CardContent>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('new_message')}</DialogTitle>
            </DialogHeader>
            <form className='flex flex-col gap-4 mt-4' onSubmit={handleCreate}>
              <Input
                placeholder={t('message_content')}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
              />
              <Select
                value={newType}
                onValueChange={(v) => setNewType(v as MessageType)}
              >
                <SelectTrigger className='w-full font-bold'>
                  <SelectValue placeholder={t('message_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MessageType.INFO}>{t('info')}</SelectItem>
                  <SelectItem value={MessageType.ALERT}>
                    {t('alert_will_be_shown_on_top')}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type='number'
                min={1}
                max={10}
                placeholder={t('priority')}
                value={newPriority}
                onChange={(e) => setNewPriority(Number(e.target.value))}
                required
              />
              <Button type='submit'>{t('create_message')}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
      {isLoading && <div>Loading messages...</div>}
      {error && (
        <div className='text-red-500'>Error: {(error as Error).message}</div>
      )}
      {messages &&
        messages.map((msg) => (
          <Card
            key={msg.id}
            className={`w-full mb-4 ${
              msg.type === 'ALERT' ? 'bg-yellow-100' : ''
            }`}
          >
            <CardContent>
              {editingId === msg.id ? (
                <form className='flex flex-col gap-2' onSubmit={handleEdit}>
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                  <Select
                    value={editType}
                    onValueChange={(v) => setEditType(v as MessageType)}
                  >
                    <SelectTrigger className='w-full font-bold'>
                      <SelectValue placeholder={t('message_type')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={MessageType.INFO}>
                        {t('info')}
                      </SelectItem>
                      <SelectItem value={MessageType.ALERT}>
                        {t('alert_will_be_shown_on_top')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type='number'
                    min={1}
                    max={10}
                    value={editPriority}
                    onChange={(e) => setEditPriority(Number(e.target.value))}
                    required
                  />
                  <div className='flex gap-2'>
                    <Button type='submit'>{t('save')}</Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setEditingId(null)}
                    >
                      {t('cancel')}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <p className='text-lg'>{msg.content}</p>
                  <p className='text-xs text-gray-500'>
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <div className='flex gap-2 mt-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => startEdit(msg)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> {t('edit')}
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => handleDelete(msg.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> {t('delete')}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
