import React, { useEffect } from "react";
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
import styles from "./ProfilePage.module.css";
import avatar from "../../assets/avatar2.jpg";
import ProfileScoreCard from "../../components/ProfileScoreCard/ProfileScoreCard";
import usePersonalInformation from "../../hooks/usePersonalInformation";
import { getUserInfo } from "../../utils/localstorage";
import useUserDanceScores from "../../hooks/useUserDanceScores";
import NavBar from "../../components/NavBar/NavBar";

const ProfilePage = () => {
  const userName = getUserInfo();
  const { name, email } = usePersonalInformation(
    import.meta.env.VITE_API_URL,
    userName
  );
  const { score } = useUserDanceScores(userName);
  useEffect(() => {
    console.log(score);
  }, [score]);

  return (
    <div className={styles.body}>
      <NavBar/>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        className={styles.profile_container}
      >
        <Stack className={styles.profile_information}>
          <CardBody>
            <Heading className={styles.profile_heading}>Profile</Heading>

            <Text py="2">Name: {name}</Text>
            <Text py="2">User Name: {userName}</Text>
            <Text py="2">
              Email: {email} 
            </Text>
          </CardBody>
        </Stack>
        <div className={styles.avatar_container}>
          <Image
            objectFit="cover"
            maxW={{ base: "100%", sm: "200px" }}
            src={avatar}
            alt="Caffe Latte"
            className={styles.user_avatar}
          />
        </div>
      </Card>

      <div>
        {score && score.length > 0 ? (
          score.map((item, index) => (
            <ProfileScoreCard
              key={index}
              refVideoName={item.ref_video_name}
              score={item.avgScores.total_score} 
              attempt= {'1'}
              timestamp={item.time_stamp} 
              id={item._id}
            />
          ))
        ) : (
          <p>Loading scores...</p>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;
