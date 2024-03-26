from __future__ import annotations

def is_in_frame(self, threshold: int = 0.3, match_ref = False, ref_keypoints: 'Keypoints' = None) -> tuple[int, int]:
    top = bottom = False
    presences = self.get_presences(threshold)

    if match_ref:
        present_ref_points = {name: kp for name, kp in ref_keypoints.to_dict().items() if ref_keypoints.get_presences()[name]}

        lowest_ref_point, _ = max((name, kp.y) for name, kp in present_ref_points.items())
        highest_ref_point, _ = min((name, kp.y) for name, kp in present_ref_points.items())

        top = presences[highest_ref_point]
        bottom = presences[lowest_ref_point]

    else:
        top = presences["left_shoulder"] and presences["right_shoulder"]
        bottom = presences["left_ankle"] and presences["right_ankle"]

    return int(top), int(bottom)
    
