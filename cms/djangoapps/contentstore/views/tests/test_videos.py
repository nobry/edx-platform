from mock import patch, MagicMock
from contentstore.tests.utils import CourseTestCase
from contentstore.utils import reverse_course_url
from django.core.exceptions import PermissionDenied
from xmodule.modulestore.django import modulestore


@patch.dict("django.conf.settings.FEATURES", {'ENABLE_VIDEO_UPLOAD_PIPELINE': True})
class VideoUploadTestCase(CourseTestCase):
    """
    Test cases for the video upload page
    """
    def setUp(self):
        super(VideoUploadTestCase, self).setUp()
        self.url = reverse_course_url('videos_handler', self.course.id)

    def test_video_pipeline_not_configured_error(self):
        response = self.client.ajax_post(
            self.url
        )
        self.assertEqual(response.status_code, 400)

    def test_non_staff_user(self):
        client, nonstaff_user = self.create_non_staff_authed_user_client()
        response = client.ajax_post(
            self.url
        )
        self.assertEqual(response.status_code, 403)

    @patch('boto.s3.connection.S3Connection')
    @patch('boto.s3.key.Key')
    def test_success_mock_storage_service(self, s3_key, s3_connection):
        self.course.video_upload_pipeline = {
            'Institute_Name': 'Test University',
            'Access_Token': 'xxx',
        }
        self.store.update_item(self.course, self.user.id)
        response = self.client.ajax_post(
            self.url,
            data={
                'files': [
                    {'file_name': 'file1'},
                    {'file_name': 'file2'},
                ]
            }
        )
        self.assertEqual(response.status_code, 200)
