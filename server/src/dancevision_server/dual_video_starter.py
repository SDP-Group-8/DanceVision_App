from pathlib import Path

from dancevision_server.video_saver import VideoSaver

from pose_estimation.scoring.euclidean_score import EuclideanScore as Score

from dancevision_server.keypoint_responders.keypoint_score import KeypointScore
from dancevision_server.mux.mux import Mux
from dancevision_server.video_loader import VideoLoader
from dancevision_server.recorder import Recorder
from dancevision_server.score_estimator import ScoreEstimator
from dancevision_server.score_aggregator import ScoreAggregator
from dancevision_server.video_starter import VideoStarter

class DualVideoStarter:

    def __init__(self, stream_address: str, stream_port: str, mux: Mux, file: str, connection_offers: dict, connection_answers: dict):
        self.stream_address = stream_address
        self.stream_port = stream_port
        self.file = file
        self.connection_offers = connection_offers
        self.connection_answers = connection_answers

        self.mux = mux
        self.recorded_track = None
        self.comparison = None

    def __load_score_estimator(self, video_name):
        self.video_loader = VideoLoader(Path(video_name))

        keypoints = self.video_loader.load_keypoints()
        if keypoints:
            score_estimator = ScoreEstimator(keypoints, Score())
            return score_estimator

    async def start(self, video_name: str, basename: str, score_aggregator: ScoreAggregator):
        score_estimator = self.__load_score_estimator(video_name)

        recorder = Recorder()
        recorder.initialize(basename)

        offer = await VideoStarter.get_offer(self.connection_offers)

        kwargs = {"file": self.file}

        keypoint_feedback = KeypointScore(score_estimator, score_aggregator)
        filepath = VideoSaver.get_video_filepath(video_name)

        self.streamer = await self.mux.create_dual_stream(offer, keypoint_feedback, recorder, self.connection_offers, self.connection_answers, filepath, **kwargs)
        return recorder.get_recording_datetime()
