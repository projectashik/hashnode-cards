import { NextApiRequest, NextApiResponse } from 'next';

export default async function FetchHashnodeData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;
  let following = 0,
    followers = 0,
    impressions = 0,
    postsCount = 0;
  let photo = '',
    name = '',
    blogHandle = '';
  let loadMoreData = true;
  const apiRes = await fetch('https://api.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query($username: String!) {
      user(username: $username) {
        photo
        name
        numFollowing
        numFollowers
        numReactions
        blogHandle
      }
    }`,
      variables: {
        username,
      },
    }),
  });
  const apiData = await apiRes.json();
  console.log(apiData);
  if (apiData.data) {
    if (apiData.data.user) {
      following = apiData.data.user.numFollowing;
      followers = apiData.data.user.numFollowers;
      impressions = apiData.data.user.numReactions;
      photo = apiData.data.user.photo;
      name = apiData.data.user.name;
      blogHandle = apiData.data.user.blogHandle;
      loadMoreData = true;
      let i = 0;
      while (loadMoreData) {
        const postsRes = await fetch('https://api.hashnode.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `query($username: String!, $page: Int) {
              user(username: $username) {
                publication {
                  posts(page: $page
                  ) {
                    title
                    _id
                  }
                }
              }
            }
            `,
            variables: {
              username,
              page: i,
            },
          }),
        });
        const postsJson = await postsRes.json();
        if (postsJson.data) {
          if (postsJson.data.user) {
            if (postsJson.data.user.publication.posts) {
              if (postsJson.data.user.publication.posts.length > 0) {
                postsCount += postsJson.data.user.publication.posts.length;
                console.log(postsCount);
                i++;
              } else {
                loadMoreData = false;
              }
            }
          }
        }
      }
    }
  }

  const returnData = {
    followers,
    following,
    impressions,
    postsCount,
    photo,
    name,
    blogHandle,
  };
  res.json(returnData);
}
