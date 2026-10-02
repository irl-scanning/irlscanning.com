"""Run with: python3 -m unittest discover -s tests."""

import pathlib
import unittest


WORKFLOWS = pathlib.Path(__file__).resolve().parents[1] / ".forgejo/workflows"


class GarageEndpointsTest(unittest.TestCase):
    def test_deployments_use_nas_https_services(self):
        for name in ("preview.yml", "staging.yml"):
            with self.subTest(workflow=name):
                workflow = (WORKFLOWS / name).read_text()
                self.assertIn(
                    "AWS_ENDPOINT_URL: https://s3.intranet.irlscanning.com",
                    workflow,
                )
                self.assertIn(
                    "GARAGE_ADMIN_URL: https://admin.s3.intranet.irlscanning.com",
                    workflow,
                )
                self.assertIn('"$GARAGE_ADMIN_URL/v2/GetBucketInfo', workflow)
                self.assertIn('"$GARAGE_ADMIN_URL/v2/CreateBucket"', workflow)
                self.assertNotIn("http://garage", workflow)
                self.assertNotIn("--insecure", workflow)
                self.assertNotIn("--no-verify-ssl", workflow)

    def test_staging_checks_bucket_website_not_container_root(self):
        workflow = (WORKFLOWS / "staging.yml").read_text()
        self.assertIn("https://site.intranet.irlscanning.com/staging/", workflow)


if __name__ == "__main__":
    unittest.main()
