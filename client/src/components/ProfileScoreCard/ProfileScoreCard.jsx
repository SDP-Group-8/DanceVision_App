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

const ProfileScoreCard = ({refVideoName, timestamp, score, attempt, id}) => {
  const navigate = useNavigate();

  const handleSubmit =( ) =>
  {
    navigate(`/scoring?id=${id}`)
  }
  
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
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
          className={styles.video}
        />

        <Stack>
          <CardBody>
            {/* <Heading size="md">The perfect latte</Heading> */}

            <Text py="2">
              {refVideoName}
            </Text>
            <Text py="2">
              Score: {score}%
            </Text>
            <Text py="2">
              Attempt : {attempt}
            </Text>
            <Text py="2">
              Date and Time : {timestamp}
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
