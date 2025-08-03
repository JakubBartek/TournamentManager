import { NavbarEdit } from '@/components/Navbar/NavbarEdit'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useTournament } from '@/hooks/useTournament'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TournamentType } from '@/types/tournament'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useTournamentCreateSchedule } from '@/hooks/useTournament'
import { toast } from 'sonner'

export default function EditSchedule() {
  const location = useLocation()
  const fromCreate = location.state?.fromOptions
  const navigate = useNavigate()
  const { mutate: createSchedule } = useTournamentCreateSchedule()

  const { tournamentId } = useParams()
  const { data: tournament } = useTournament(tournamentId || '')
  const [tournamentType, setTournamentType] = useState(
    tournament?.type || TournamentType.GROUPS,
  )
  const [schedulingMethod, setSchedulingMethod] = useState('option-one')
  const [groupCount, setGroupCount] = useState(2)

  const handleCreateGroupStagePairings = () => {
    createSchedule(
      {
        tournamentId: tournament?.id || '',
        numberOfGroups: groupCount,
        autoCreate: schedulingMethod === 'option-one',
      },
      {
        onSuccess: () => {
          navigate(`/${tournamentId}/schedule`, {
            state: { fromCreate: true },
          })
          toast.success(
            'Group stage pairings created successfully! You can edit them later.',
          )
        },
      },
    )
  }

  return (
    <div className='max-w-xl mx-auto my-16 flex flex-col items-center w-full'>
      <NavbarEdit />
      <h2 className='text-xl font-bold'>
        {fromCreate && '5. Create Schedule'}
      </h2>
      {fromCreate && (
        <Card className='w-full mt-4 shadow-lg'>
          <CardContent>
            <Select>
              <SelectTrigger className='w-full font-bold'>
                <SelectValue placeholder='Select Tournament Type' />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TournamentType).map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    onClick={() => setTournamentType(type)}
                  >
                    {type.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {tournamentType === TournamentType.GROUPS && (
              <>
                <Select>
                  <SelectTrigger className='w-full font-bold mt-6'>
                    <SelectValue placeholder='Select Number of Groups' />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((num) => (
                      <SelectItem
                        key={num}
                        value={`group-${num}`}
                        onClick={() => setGroupCount(num)}
                      >
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            <h3 className='text-m font-semibold mt-4'>
              Choose Scheduling Method
            </h3>
            <p className='text-xs text-gray-500'>
              You can edit the schedule later if needed.
            </p>
            <RadioGroup
              value={schedulingMethod}
              onValueChange={setSchedulingMethod}
            >
              <div className='flex items-center space-x-2 mt-2 justify-center gap-8'>
                <div>
                  <RadioGroupItem value='option-one' id='option-one' />
                  <Label htmlFor='option-one'>Auto Schedule</Label>
                </div>
                <div>
                  <RadioGroupItem value='option-two' id='option-two' />
                  <Label htmlFor='option-two'>Manual Schedule</Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}
      {fromCreate && tournamentType == TournamentType.GROUPS && (
        <Button className='mt-4' onClick={handleCreateGroupStagePairings}>
          Create Group Stage Pairings
        </Button>
      )}

      {tournamentType != TournamentType.GROUPS && (
        // TODO: Implement other tournament types
        <Card className='w-full mt-8 shadow-lg'>
          <CardContent>
            <h2 className='text-xl font-bold mb-4'>
              This type of tournament is under development
            </h2>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
