import { Converter } from 'typedoc';

/** Makes a lone @summary tag the visible TypeDoc description. */
export function load(application) {
  application.converter.on(Converter.EVENT_RESOLVE, (_context, reflection) => {
    const comment = reflection.comment;
    if (comment === undefined) return;

    if (comment.summary.length === 0) {
      const summary = comment.getTag('@summary');
      if (summary !== undefined && summary.content.length > 0) {
        comment.summary = summary.content.map((part) => ({ ...part }));
      }
    }

    const examples = comment.blockTags.filter((tag) => tag.tag === '@example');
    if (examples.length > 0) {
      comment.blockTags = [
        ...examples,
        ...comment.blockTags.filter((tag) => tag.tag !== '@example'),
      ];
    }
  });
}
