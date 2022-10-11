// @ts-nocheck
import { useState } from 'react';
import EntranceForm from 'components/entrance/EntranceForm'
import EntranceView from 'components/entrance/EntranceView';
import { entranceProps} from "types";
import { useSession } from "next-auth/react";

interface Props {
  id: string;
  entranceData: entranceProps;
}

const Wrapper = () => {
  const { data: session } = useSession();
  const id = session?.user?.idNumber
  const entranceData = {
    reserved: true,
    dates: [11, 13],
    accompaniers: 2,
  }
  return (
    <Entrance id={id} entranceData={entranceData} />
  )
}

const Entrance = ({id, entranceData}:Props) => {
  const openForm = () => setIsEditing(true);
  const [isEditing, setIsEditing] = useState(false);
  const closeForm = () => setIsEditing(false);
  return (
    <>
      {!entranceData.reserved || isEditing ? (
        <EntranceForm
          id={id}
          data={entranceData}
          closeForm={closeForm}
        />
      ) : (
        <EntranceView
          id={id}
          data={entranceData}
          openForm={openForm}
        />
      )}
    </>
  )
}

export default Wrapper