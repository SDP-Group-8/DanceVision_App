import React from "react";
import {
  Card,
  Stack,
  Image,
  CardBody,
  Heading,
  CardFooter,
  Button,
  Text,
  Avatar,
} from "@chakra-ui/react";
import styles from './ProfileScoreCard.module.css'
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../utils/localstorage";

const ProfileScoreCard = ({refVideoName, timestamp, score, attempt, id}) => {
  const navigate = useNavigate();

  const handleSubmit =( ) =>
  {
    navigate(`/scoring?id=${id}`)
  }
  
  const date = new Date(timestamp)
  const username = getUserInfo()
  const imageSrc = `${import.meta.env.VITE_API_URL}/user_thumbnails/${username}/thumbnails/${timestamp}.jpg`

  return (
    <div className={styles.body}>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        className={styles.card}
      >
        <Image
          objectFit="cover"
        //   maxW={{ base: "100%", sm: "200px" }}
          src={imageSrc}
          alt="Caffe Latte"
          className={styles.video}
        />

        <Stack>
          <CardBody>
            {/* <Heading size="md">The perfect latte</Heading> */}

            <Text py="2">
              Reference Video : {refVideoName}
            </Text>
            <Text py="2">
              Score: {(100 * score).toFixed(2)}%
            </Text>
            <Text py="2">
              Attempt : {attempt}
            </Text>
            <Text pt="2">
              Date and Time : {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" colorScheme="blue" onClick={handleSubmit}>
              Check Score
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
};

export default ProfileScoreCard;
