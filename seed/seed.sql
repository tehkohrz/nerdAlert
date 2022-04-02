-- user 1
INSERT INTO users (id, userName, realName, password) VALUES (
  'f5811344-ebcd-40f9-a7c5-fbe7b6036157', 
  'tehkohrz',
  'DK',
'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd'
);
-- user 2
INSERT INTO users (id, userName, realName, password) VALUES (
  'a14967b5-7c43-46b2-9abd-e18e8e972e54', 
  'toshi',
  'Dog',
'fb131bc57a477c8c9d068f1ee5622ac304195a77164ccc2d75d82dfe1a727ba8d674ed87f96143b2b416aacefb555e3045c356faa23e6d21de72b85822e39fdd'
);
-- file owned by user 1
INSERT INTO files (id, fileName, codeData, user_id) VALUES (
  '99caebe0-3b34-4b16-85a5-9190298a375d',
  'TESTFILE',
  'Hello World!',
  'f5811344-ebcd-40f9-a7c5-fbe7b6036157'
);
-- group created
INSERT INTO groups (id, name) VALUES (
  'b02cf5c2-2bbe-4b7f-a7ee-136045d9a42c',
  'Rocket Academy'
);
-- group linking user 1 to the group
INSERT INTO group_user (id, user_id, group_id) VALUES (
  'eb5b5aee-3f91-4237-b95a-5ac03f0bd25c',
  'f5811344-ebcd-40f9-a7c5-fbe7b6036157',
  'b02cf5c2-2bbe-4b7f-a7ee-136045d9a42c'
);
-- file owned by user 2
INSERT INTO files (id, fileName, codeData, user_id) VALUES (
  '49a8fdca-b924-4f21-8349-acec8e5504fa',
  'In Class Exercise',
  'Hello Rocket World!',
  'a14967b5-7c43-46b2-9abd-e18e8e972e54'
);

-- You dont add persmission for the person that created the file
-- File search will retrieve those owned by him
-- user 2 grant persmission to the group
INSERT INTO filePermissions (id, user_id, file_id) VALUES (
  'dac2cbd8-c5f6-4099-8f36-aefad0f932e1',
  'b02cf5c2-2bbe-4b7f-a7ee-136045d9a42c',
  '49a8fdca-b924-4f21-8349-acec8e5504fa'
);