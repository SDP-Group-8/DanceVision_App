import av

class ThumbnailCreator:
    thumbnail_extension = "jpg"

    @staticmethod
    def create(video_src_path: str, img_output_path: str):
        with av.open(str(video_src_path), "r") as container:
            # Signal that we only want to look at keyframes.
            stream = container.streams.video[0]
            stream.codec_context.skip_frame = "NONKEY"

            frame = next(container.decode(stream))

            frame.to_image().save(
                img_output_path,
                quality=80,
            )