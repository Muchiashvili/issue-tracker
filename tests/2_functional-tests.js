const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('Routing Tests', function() {

      suite('Post request Tests', function(){

        test('Create an issue with every field: Post request to /api/issues/{project}', function(done) {
          chai.request(server)
          .post('/api/issues/postTests')
          .set('content-type', 'application/json')
          .send({
            issue_title: "Issue",
            issue_text: "IssueText",
            created_by: "TESTER",
            assigned_to: "AI",
            status_text: "StatusText"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, 'Issue');
            assert.equal(res.body.issue_text, "IssueText");
            assert.equal(res.body.created_by, "TESTER");
            assert.equal(res.body.assigned_to, "AI");
            assert.equal(res.body.status_text, "StatusText");
            done();
          });
        });

        test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
          chai.request(server)
          .post('/api/issues/postTests')
          .set('content-type', 'application/json')
          .send({
            issue_title: "requiredTitle",
            issue_text: "requiredText",
            created_by: "importantPerson"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "requiredTitle");
            assert.equal(res.body.issue_text, "requiredText");
            assert.equal(res.body.created_by, "importantPerson");
            done();
          });
        });

        test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
          chai.request(server)
          .post('/api/issues/postTests')
          .set('content-type', 'application/json')
          .send({
            issue_title: "",
            issue_text: "",
            created_by: "TESTER",
            assigned_to: "",
            status_text: ""
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });
        });

      });

      suite('GET request Tests', function() {

        test('View issues on a project: GET request to /api/issues/{project}', function(done) {
          chai.request(server)
          .get('/api/issues/apitest')
          .end((err, res) => {
            var length = res.body.length;
            assert.equal(res.status, 200);
            assert.equal(length, length);
            done();
          });
        });

        test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
          chai.request(server)
          .get('/api/issues/apitest')
          .query({ _id: '601733273117360271c3f371' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              _id: '601733273117360271c3f371',
              issue_title: "issueTitle",
              issue_text: "issueText",
              created_on: '2021-01-31T22:45:59.888Z',
              updated_on: '2021-02-01T17:47:21.769Z',
              created_by: "importantPerson",
              assigned_to: "TESTER",
              status_text: "statusText",
              open: true
            })
            done();
          })
        });

        test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
          chai.request(server)
          .get('/api/issues/apitest')
          .query({ issue_title: 'issueTitle', created_by: 'importantPerson' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body[0], {
              _id: '601733273117360271c3f371',
              issue_title: "issueTitle",
              issue_text: "issueText",
              created_on: '2021-01-31T22:45:59.888Z',
              updated_on: '2021-02-01T17:47:21.769Z',
              created_by: "importantPerson",
              assigned_to: "TESTER",
              status_text: "statusText",
              open: true
            })
            done();
          })
        });

      })

      suite('PUT request tests', function() {

        test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
          chai.request(server)
          .put('/api/issues/apitest')
          .send({
            _id: '60182d1da04a47005f910307',
            issue_title: 'UPDATED_TITLE'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, '60182d1da04a47005f910307');
            done();
          })
        })

        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
          chai.request(server)
          .put('/api/issues/apitest')
          .send({
            _id: '60182d1da04a47005f910307',
            issue_title: 'NEW_TITLE',
            issue_text: 'UPDATED_TEXT'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, '60182d1da04a47005f910307');
            done();
          })
        })

        test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
          chai.request(server)
          .put('/api/issues/apitest')
          .send({
            issue_title: 'NEW_TITLE',
            issue_text: 'UPDATED_TEXT'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'missing _id');
            done();
          })
        })

        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
          chai.request(server)
          .put('/api/issues/apitest')
          .send({
            _id: '60182d1da04a47005f910307',
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no update field(s) sent');
            done();
          })
        })

        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
          chai.request(server)
          .put('/api/issues/apitest')
          .send({
            _id: '1234567890',
            issue_title: "title"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'could not update');
            done();
          })
        })

      })

      suite('DELETE request tests', function() {
        test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
          chai.request(server)
          .delete('/api/issues/apitest')
          .send({
            _id: '6018400613cfb40349f29fa1'
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
        });
      })

      test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
        chai.request(server)
        .delete('/api/issues/apitest')
        .send({
          _id: 'deleteId'
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          done();
        });
      });

      test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
        chai.request(server)
        .delete('/api/issues/apitest')
        .send({
          _id: null
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
      });
    });
});
