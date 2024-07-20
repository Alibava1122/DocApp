import { Image } from 'react-native';

export const prefetch = (links = []) => {
  Image.queryCache(links)
    .then((cachedLinksMap) => {
      links.forEach((src) => {
        if (!cachedLinksMap[src]) {
          Image.prefetch(src).catch((err) => console.log(err));
        }
      });
    })
    .catch((err) => console.log(err));
};
