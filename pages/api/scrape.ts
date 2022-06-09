import { load } from 'cheerio';
import { NextApiRequest, NextApiResponse } from 'next';

const getRawData = (url: string) => {
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      return text;
    });
};
export default async function ScrapeHashnodeData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({
      statusCode: 400,
      message: 'Missing username',
    });
  }
  const profileRawData = await getRawData('https://hashnode.com/@' + username);
  const profileParsedData = load(profileRawData);
  const url = profileParsedData(
    '#__next > div.css-icgnyh > main > main > div.css-ph2p54 > div > div > div.css-8gy3rm > div.css-1491s55 > div.css-3abrc0 > a > span'
  ).text();

  const notFound =
    profileParsedData(
      '#__next > div.css-1mt0fqe > div > div.css-1azakc > p.css-4mei6l'
    ).text() === '404';
  if (notFound) {
    res.status(404).json({
      statusCode: 404,
      message: 'User not found',
    });
  }
  const badgesRawData = await getRawData('https://' + url + '/badges');
  const badgesParsedData = load(badgesRawData);
  const badges = badgesParsedData(
    '#__next > div > div > div > div.css-rsvr7z img'
  );
  const badgesSrcs = badges.toArray().map((badge) => {
    // @ts-ignore
    return badge.attribs.src;
  });
  res.json({
    url,
    badges: badgesSrcs,
  });
}
