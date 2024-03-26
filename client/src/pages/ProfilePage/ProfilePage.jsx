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

const ProfilePage = () => {
  const userName = getUserInfo();
  const { name, email } = usePersonalInformation(
    import.meta.env.VITE_API_URL,
    userName
  );
  const { data } = useUserDanceScores(userName);
  useEffect(() => {
    console.log(data); 
  }, [data]);

  return (
    <div className={styles.body}>
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
              Email: {email} {data}
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

      <ProfileScoreCard
        refVideoName={"Finesse Step"}
        score={"90"}
        attempt={"2"}
        timestamp={"21st March 2024 23:20:25"}
        id={"6602a6b812ed1e46fa7180fc"}
      ></ProfileScoreCard>

      <div>
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <ProfileScoreCard
              key={index}
              refVideoName={item.ref_video_name}
              score={calculateScore(item.avgScores)} // You need to implement calculateScore function
              attempt={index + 1} // Assuming attempt starts from 1
              timestamp={formatTimestamp(item.time_stamp)} // You need to implement formatTimestamp function
              id={item._id}
            />
          ))}
      </div>
    </div>
  );
};

export default ProfilePage;
