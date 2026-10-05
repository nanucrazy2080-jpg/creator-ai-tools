const pick = (items, seed = 0) => items[Math.abs(seed) % items.length];
const hash = (value) => [...value].reduce((total, char) => total + char.charCodeAt(0), 0);
const clean = (value) => value.trim();

export const tools = [
  {
    id: 'video', name: 'Video prompt', title: 'AI video prompt generator',
    description: 'Turn a scene in your head into a production-ready video prompt.',
    shortDescription: 'Plan your next moving picture.', icon: 'Clapperboard', tint: 'mint', time: '30 sec',
    fields: [
      { name: 'subject', label: 'What happens in the scene?', placeholder: 'A lone surfer walks toward the ocean at sunrise', required: true },
      { name: 'style', label: 'Visual style', type: 'select', options: ['Cinematic realism', 'Documentary', 'Dreamlike', 'Vintage film', 'High fashion', 'Animated'] },
      { name: 'camera', label: 'Camera movement', type: 'select', options: ['Slow tracking shot', 'Gentle handheld', 'Locked-off frame', 'Sweeping dolly', 'Aerial drift'] },
      { name: 'mood', label: 'Mood', type: 'select', options: ['Quietly hopeful', 'Playful', 'Tense and atmospheric', 'Warm and nostalgic', 'Bold and energetic'] },
      { name: 'details', label: 'Extra details', placeholder: 'Light, setting, color palette…' },
    ],
    generate: (v) => `${clean(v.style)} video of ${clean(v.subject)}. ${v.camera}, natural movement and believable physics. ${v.mood} atmosphere, considered composition, soft film grain, and carefully controlled lighting. ${clean(v.details) ? `${clean(v.details)}. ` : ''}No text, logos, or abrupt transitions.`,
  },
  {
    id: 'image', name: 'Image prompt', title: 'AI image prompt generator',
    description: 'Build a detailed image prompt with a style, light, and point of view.',
    shortDescription: 'Shape the image before it exists.', icon: 'Image', tint: 'peach', time: '20 sec',
    fields: [
      { name: 'subject', label: 'What do you want to see?', placeholder: 'A tiny bookshop tucked into a rainy alley', required: true },
      { name: 'style', label: 'Art direction', type: 'select', options: ['Editorial photography', '35mm film', 'Painterly illustration', 'Minimal 3D', 'Analog collage', 'Architectural digest'] },
      { name: 'lighting', label: 'Lighting', type: 'select', options: ['Soft morning light', 'Overcast and diffused', 'Golden hour', 'Direct flash', 'Moody chiaroscuro'] },
      { name: 'framing', label: 'Composition', type: 'select', options: ['Wide establishing shot', 'Intimate close-up', 'Centered and symmetrical', 'Candid off-center', 'Overhead flat lay'] },
      { name: 'details', label: 'Details to include', placeholder: 'Texture, colors, props…' },
    ],
    generate: (v) => `${v.style} image of ${clean(v.subject)}, ${v.framing.toLowerCase()}. ${v.lighting}, a cohesive restrained palette, tactile detail, intentional negative space, and nuanced texture. ${clean(v.details) ? `Include ${clean(v.details)}. ` : ''}Thoughtful art direction, crisp focal point, no text or watermark.`,
  },
  {
    id: 'titles', name: 'YouTube titles', title: 'YouTube title generator',
    description: 'Find a sharper, more clickable way to frame your next video.',
    shortDescription: 'Give the idea a headline.', icon: 'Type', tint: 'lemon', time: '15 sec',
    fields: [
      { name: 'topic', label: 'What is your video about?', placeholder: 'Learning to cook without a recipe', required: true },
      { name: 'audience', label: 'Who is it for?', placeholder: 'Beginner home cooks' },
      { name: 'tone', label: 'Title style', type: 'select', options: ['Curiosity-led', 'How-to', 'Personal story', 'Contrarian', 'Clear and direct'] },
      { name: 'keyword', label: 'Keyword to include', placeholder: 'e.g. intuitive cooking' },
    ],
    generate: (v) => {
      const topic = clean(v.topic);
      const audience = clean(v.audience);
      const keyword = clean(v.keyword);
      const titles = {
        'Curiosity-led': [`I Tried ${topic} for 30 Days. Here's What Changed`, `The Surprising Truth About ${topic}`, `What Nobody Tells You About ${topic}`, `I Didn't Expect This When I Started ${topic}`],
        'How-to': [`How to Get Started With ${topic} (A Simple Guide)`, `${topic}: Everything I Wish I Knew Before I Started`, `The Beginner's Guide to ${topic}`, `My Step-by-Step Approach to ${topic}`],
        'Personal story': [`I Completely Changed My Mind About ${topic}`, `My Honest Experience With ${topic}`, `Why I Finally Gave ${topic} a Chance`, `What ${topic} Taught Me About Starting Over`],
        'Contrarian': [`Why I Stopped Overthinking ${topic}`, `You Probably Don't Need to Be Good at ${topic}`, `The Case for Doing ${topic} the Simple Way`, `Maybe We've Been Thinking About ${topic} All Wrong`],
        'Clear and direct': [`${topic}: What Worked and What Didn't`, `A Realistic Guide to ${topic}`, `${topic} Explained Simply`, `What to Know Before You Try ${topic}`],
      };
      return titles[v.tone].map((title, index) => `${keyword && index % 2 === 0 ? `${keyword}: ` : ''}${title}${audience && index === 1 ? ` (for ${audience})` : ''}`);
    },
  },
  {
    id: 'description', name: 'YouTube description', title: 'YouTube description generator',
    description: 'Draft an inviting, well-structured description for your upload.',
    shortDescription: 'Set the scene, then hit publish.', icon: 'AlignLeft', tint: 'sky', time: '30 sec',
    fields: [
      { name: 'title', label: 'Video title', placeholder: 'A slow Sunday in the garden', required: true },
      { name: 'summary', label: 'What happens in the video?', type: 'textarea', placeholder: 'The story, takeaway, or key moments…', required: true },
      { name: 'links', label: 'Links or resources', placeholder: 'https://…' },
      { name: 'cta', label: 'Call to action', placeholder: 'Subscribe for weekly studio notes' },
    ],
    generate: (v) => `${clean(v.title)}\n\n${clean(v.summary)}\n\n${clean(v.cta) || 'If this was useful, subscribe for more.'}${clean(v.links) ? `\n\nLINKS & RESOURCES\n${clean(v.links)}` : ''}\n\nThanks for spending a little time here.\n\n#Creator #BehindTheScenes`,
  },
  {
    id: 'hashtags', name: 'Hashtags', title: 'Hashtag generator',
    description: 'Find a balanced mix of topic-specific and discovery hashtags.',
    shortDescription: 'Help the right people find you.', icon: 'Hash', tint: 'lilac', time: '10 sec',
    fields: [
      { name: 'topic', label: 'Post topic', placeholder: 'A week of slow fashion outfits', required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'TikTok', 'YouTube', 'LinkedIn'] },
      { name: 'niche', label: 'Your niche', placeholder: 'e.g. sustainable style' },
      { name: 'count', label: 'Number of hashtags', type: 'select', options: ['8', '12', '18', '25'] },
    ],
    generate: (v) => {
      const topic = clean(v.topic).toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      const niche = clean(v.niche).toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
      const topicTag = topic.map((word) => `#${word}`).slice(0, 3);
      const nicheTag = niche.map((word) => `#${word}`).slice(0, 3);
      const specific = [`#${topic.join('')}`, `#${topic.slice(-2).join('')}`, ...nicheTag, '#CreatorCommunity', '#CreativeProcess', '#MadeWithIntention', '#InspirationDaily', '#ContentCreator', '#DiscoverMore', '#NewPost', '#BehindTheScenes', '#OnlineCommunity', '#CreateEveryDay', '#ExploreYourFeed', '#ShareYourStory', '#FreshPerspective', '#CreatorTips'];
      const platformTags = { Instagram: ['#InstaDaily', '#InstaGood', '#ReelsInstagram'], TikTok: ['#TikTokCreator', '#ForYou', '#TikTokMadeMe'], YouTube: ['#YouTubeCreator', '#YouTubeCommunity', '#NewVideo'], LinkedIn: ['#ProfessionalGrowth', '#BuildInPublic', '#IndustryInsights'] };
      return [...new Set([...topicTag, ...nicheTag, ...platformTags[v.platform], ...specific])].slice(0, Number(v.count));
    },
  },
  {
    id: 'story', name: 'Story & script', title: 'AI story & script generator',
    description: 'Turn a loose idea into a script with a real beginning and payoff.',
    shortDescription: 'Give your next story a first draft.', icon: 'BookOpenText', tint: 'rose', time: '45 sec',
    fields: [
      { name: 'idea', label: 'The seed of your story', type: 'textarea', placeholder: 'A shy musician gets one unexpected chance to perform…', required: true },
      { name: 'format', label: 'Format', type: 'select', options: ['Short video (under 60 sec)', 'YouTube video', 'Narrated story', 'Podcast intro'] },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Warm and intimate', 'Funny and self-aware', 'Thoughtful', 'Suspenseful', 'Encouraging'] },
      { name: 'audience', label: 'Made for', placeholder: 'Curious creative people' },
    ],
    generate: (v) => {
      const idea = clean(v.idea);
      const audience = clean(v.audience) || 'anyone who has ever had an idea they almost talked themselves out of';
      const opening = pick({
        'Warm and intimate': ['I used to think the hard part was getting started.', 'Here is the part of the story I almost left out.'],
        'Funny and self-aware': ['I had a plan. It lasted about twelve minutes.', 'This is the story of how I confidently made things harder than they needed to be.'],
        Thoughtful: ['It began with one small, ordinary decision.', 'I keep coming back to one quiet moment.'],
        Suspenseful: ['Something was off, and I could not quite say what.', 'At first, everything seemed completely ordinary.'],
        Encouraging: ['If you are waiting to feel ready, this is for you.', 'I almost talked myself out of trying. Almost.'],
      }[v.tone], hash(idea));
      const moment = pick({
        'Warm and intimate': ['Then, just when it seemed easier to walk away, something shifted.', 'But a small detail changed the way the whole story looked.'],
        'Funny and self-aware': ['Naturally, I chose the one approach that made it more complicated.', 'That was the moment I realized the instructions were upside down.'],
        Thoughtful: ['It was not the grand breakthrough I expected. It was something quieter.', 'The smallest detail changed the way the whole story looked.'],
        Suspenseful: ['Then I noticed the one detail that did not belong.', 'Everything changed when I looked a little closer.'],
        Encouraging: ['So I stopped waiting for a perfect plan and tried one imperfect thing.', 'The first try was messy, but it was a real beginning.'],
      }[v.tone], hash(`${idea}${v.tone}`));
      const ending = pick({
        'Warm and intimate': ['That is the version I want to remember, and the one I wanted to share with you.', 'Sometimes the smallest beginning is the one that changes everything.'],
        'Funny and self-aware': ['Would I do it that way again? Absolutely not. Would I do it again? Probably.', 'At least now I know what not to do next time. Progress.'],
        Thoughtful: ['The point was never to get it perfect. It was to see what happened next.', 'Maybe the next chapter starts before you feel ready.'],
        Suspenseful: ['I still do not know what happens next. That might be the best part.', 'Some questions are better left open, at least for now.'],
        Encouraging: ['You do not have to feel ready to begin. You just have to begin.', 'A small first step still counts as a beginning.'],
      }[v.tone], hash(v.format));
      return `${v.format.toUpperCase()}\n\n[OPEN]\n${opening}\n\n[SETUP]\n${idea} This is a story for ${audience}.\n\n[TURN]\n${moment}\n\n[PAYOFF]\n${ending}\n\n[CALL TO ACTION]\nWhat would your next chapter look like? Tell me in the comments.`;
    },
  },
];