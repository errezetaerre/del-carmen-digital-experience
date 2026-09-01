# Artist Page --- Implementation Architecture

**Document ID:** DOC-ARTIST-IMPL\
**Version:** 1.1\
**Status:** 🟢 Approved / Complete / Frozen\
**Project:** Del Carmen Digital Experience\
**Brand:** Del Carmen --- Fine Art by Rō Visual\
**Page:** Artist\
**Route:** `/artist`

------------------------------------------------------------------------

# 1. Purpose

This document defines the implementation architecture for Artist Page
v1.0.

It translates the approved:

-   `artist-specification.md` v1.1
-   `artist-wireframe.md` v1.1

into a concrete implementation strategy for the current Del Carmen
codebase.

It defines:

-   route ownership;
-   domain ownership;
-   component boundaries;
-   Server and Client Component boundaries;
-   content organization;
-   media architecture;
-   motion architecture;
-   responsive strategy;
-   asset organization;
-   accessibility;
-   performance;
-   SEO responsibilities;
-   implementation sequence.

This document does not redefine the approved editorial content or
spatial composition.

------------------------------------------------------------------------

# 2. Architectural Principles

Artist should follow the existing architectural principles of Del
Carmen.

## 2.1 Server First

Components remain Server Components unless they require browser-specific
behavior.

Client Components should be introduced only for:

-   GSAP animation;
-   continuous media movement;
-   browser media APIs;
-   interactive behavior;
-   functionality requiring React client hooks.

The existence of motion inside a section does not automatically require
the entire section to become a Client Component.

------------------------------------------------------------------------

## 2.2 Local Before Shared

Artist-specific components remain inside the Artist domain.

A component should move into `shared/` only when genuine cross-domain
reuse exists.

Potential future reuse is not sufficient reason to create a shared
abstraction.

------------------------------------------------------------------------

## 2.3 Composition Before Abstraction

Sections should initially own their composition.

Small components should be extracted only when they provide:

-   meaningful responsibility separation;
-   repeated behavior;
-   media encapsulation;
-   client/server isolation;
-   improved readability.

Avoid one-file-per-element architecture.

------------------------------------------------------------------------

## 2.4 Existing Systems Remain Authoritative

Artist should reuse existing project systems wherever appropriate.

This includes:

-   global Navigation;
-   global Footer behavior where applicable;
-   `Container`;
-   typography;
-   color tokens;
-   spacing tokens where globally defined;
-   `LinkButton`;
-   artwork data;
-   artwork routes;
-   global motion/accessibility conventions.

Artist should not recreate systems already established elsewhere.

------------------------------------------------------------------------

# 3. Route Architecture

The public route is:

`/artist`

Recommended App Router entry:

\`\`\`text src/ └── app/ └── artist/ └── page.tsx

page.tsx should remain minimal.

Its responsibility is to expose the Artist domain to the App Router.

Conceptually:

import Artist from "@/domains/artist";

export default function ArtistPage() { return `<Artist />`{=html}; }

Page-level metadata may remain in the route file or be delegated
according to the existing SEO architecture when that system is
finalized.

4.  Domain Ownership

Artist is an editorial page domain.

Recommended location:

src/ └── domains/ └── artist/

Artist does not initially require:

repository; service; database model; persistence layer; query layer;
API; dedicated application service.

The domain exists because Artist owns a distinct experience and
composition, not because it requires complex business logic.

5.  Initial Domain Structure

Recommended initial structure:

src/ └── domains/ └── artist/ ├── index.tsx │ └── sections/ ├── hero/ │
├── ArtistHero.tsx │ └── ArtistHeroMotion.tsx │ ├── artist/ │ ├──
ArtistStory.tsx │ └── ArtistStoryMotion.tsx │ ├── philosophy/ │ ├──
ArtistPhilosophy.tsx │ └── ArtistPhilosophyMotion.tsx │ ├── practice/ │
├── ArtistPractice.tsx │ ├── PracticeMedia.tsx │ └──
ArtistPracticeMotion.tsx │ ├── journey/ │ ├── ArtistJourney.tsx │ ├──
JourneyMedia.tsx │ └── ArtistJourneyMotion.tsx │ └── closing/ ├──
ArtistClosing.tsx └── ArtistClosingMotion.tsx

This is a target structure, not a requirement to create every file
immediately.

If a motion implementation is trivial enough to remain readable inside a
smaller client boundary, unnecessary files should not be created merely
to match the diagram.

Likewise, section-specific components should remain inside their section
folders.

6.  Artist Composition Root

src/domains/artist/index.tsx

owns the canonical scene order.

Conceptually:

import ArtistHero from "./sections/hero/ArtistHero"; import ArtistStory
from "./sections/artist/ArtistStory"; import ArtistPhilosophy from
"./sections/philosophy/ArtistPhilosophy"; import ArtistPractice from
"./sections/practice/ArtistPractice"; import ArtistJourney from
"./sections/journey/ArtistJourney"; import ArtistClosing from
"./sections/closing/ArtistClosing";

export default function Artist() { return (
```{=html}
<main className="relative w-full min-w-0 overflow-x-clip">
```
`<ArtistHero />`{=html} `<ArtistStory />`{=html}
`<ArtistPhilosophy />`{=html} `<ArtistPractice />`{=html}
`<ArtistJourney />`{=html} `<ArtistClosing />`{=html}
```{=html}
</main>
```
); }

Canonical scene order:

Hero → The Artist → Artistic Philosophy → The Practice → The Journey →
The Work

This order must not be changed casually during implementation.

7.  Global Navigation and Footer

Global Navigation should continue to be provided by the root layout.

Artist must not render a duplicate Navigation.

The global Footer strategy should follow the current application
architecture.

If Footer is already provided globally at implementation time, Artist
should not duplicate it.

If the existing project still composes Footer at page/domain level,
Artist should reuse the existing Footer component rather than create an
Artist-specific footer.

No Artist-specific Navigation or Footer system is required.

8.  Content Strategy

Artist v1.0 contains editorial content that changes infrequently.

It does not currently justify:

CMS integration; database storage; API retrieval; content repository
abstraction.

The approved copy may initially live close to the section that renders
it.

Long structured content may be extracted into a local content file if
doing so materially improves readability.

Possible future structure:

artist/ ├── content/ │ └── artist-content.ts

However, this file should not be created automatically.

The initial implementation should prefer the simplest structure that
keeps components readable.

9.  Content Integrity

Approved editorial copy from artist-specification.md is canonical.

Implementation should not silently rewrite or shorten the approved copy
to make a layout easier.

If layout pressure reveals a content problem, the content decision
should be revisited explicitly.

Biographical facts, dates, institutional names, awards, and direct
quotations must remain consistent with the approved specification.

Unverified exact quotations should not be published as factual direct
quotations.

10. Media Asset Strategy

Artist media belongs in the public asset hierarchy.

Recommended structure:

public/ └── artist/ ├── hero/ ├── story/ ├── philosophy/ ├── practice/
├── journey/ └── closing/

This structure organizes assets by narrative responsibility rather than
by technical media type.

Avoid generic folders such as:

public/images/ public/photos/ public/misc/

for Artist-specific assets.

11. Asset Naming

Asset filenames should be:

lowercase; descriptive; stable; underscore-separated; independent of
temporary design order.

Examples:

rolando_epifania_portrait.png rolando_epifania_landscape.png
artist_painting_at_easel.jpg portrait_study_in_progress.jpg
sendero_del_sol_detail.jpg atelier_archive_01.jpg
exhibition_archive_01.jpg

Avoid:

IMG_9834.jpg photo-final-final.jpg artist1.jpg image-new.jpg

Original archival files may be preserved outside the production asset
tree if needed.

Production filenames should communicate their role or content clearly.

12. Next/Image

Static photographic assets should use the established Next.js image
system.

Implementation should provide:

meaningful alt text where appropriate; correct sizes; responsive
dimensions; controlled priority; appropriate object positioning; lazy
loading below the fold.

Only genuinely above-the-fold Hero media should normally receive
priority treatment.

Artist should not mark every editorial image as priority.

13. Image Ratios

Artist should not introduce one universal image component ratio.

Individual compositions may require:

portrait; landscape; artwork crop; archival ratio; detail crop; wide
cinematic media.

Aspect ratio belongs to the composition.

Consistency should come from visual language, not forced geometry.

14. Practice Media Architecture

PracticeMedia exists to isolate the primary Practice visual medium from
the surrounding editorial composition.

Conceptual responsibility:

ArtistPractice │ ├── editorial content ├── supporting imagery │ └──
PracticeMedia │ ├── image └── future video

Initial implementation:

`<PracticeMedia variant="image" />`{=html}

The component should not be designed as a universal media framework.

Its responsibility is specific to the Practice scene.

15. PracticeMedia API

The initial API should remain minimal.

Conceptually:

type PracticeMediaProps = { variant?: "image" \| "video"; };

However, the implementation should not introduce unused props simply to
simulate future flexibility.

If Artist v1.0 only renders an image, the first implementation may
expose only what is currently required while keeping the component
boundary suitable for future expansion.

The architectural requirement is flexibility of responsibility, not
speculative API complexity.

16. Practice Video --- Future Compatibility

If Practice later uses video, the media region should support:

poster image; muted playback where appropriate; inline playback;
controlled preload behavior; reduced-motion behavior; accessible
controls if user interaction is required; fallback imagery.

The initial Artist v1.0 implementation does not require video.

17. Journey Architecture

ArtistJourney owns:

Journey introduction; five milestones; teacher-memory editorial moment
when appropriate; Journey Media; closing Journey thought.

The milestones should initially remain local to Journey.

They do not require a project-wide milestone model.

18. Journey Milestone Data

Because Journey contains five structurally related milestones, local
structured data is appropriate.

Recommended local model:

type JourneyMilestone = { id: string; period: string; title: string;
heading: string; body: string\[\]; image?: { src: string; alt: string;
}; };

This type may live inside the Journey section unless another Artist
component genuinely needs it.

Do not create a global Artist data model for five editorial milestones.

19. Milestone Rendering

Milestones may be rendered from a local array.

Example:

const milestones: JourneyMilestone\[\] = \[ // approved Journey
content\];

This provides:

consistent markup; easier motion targeting; easier responsive
composition; simpler maintenance.

The renderer must still allow individual editorial variation where
needed.

The first milestone, for example, may contain the teacher-memory
fragment.

The model should not become so rigid that every milestone must look
identical.

20. JourneyMedia Responsibility

JourneyMedia is a dedicated Artist component responsible for the visual
memory sequence.

Its role is distinct from:

artwork gallery; archive; slideshow; carousel; artwork navigation.

It should not depend on Gallery components from the Artwork domain.

Journey Media is editorial media.

21. JourneyMedia Initial Variant

The preferred Artist v1.0 implementation is:

a slow continuous photographic sequence moving right to left.

The sequence may contain images with different:

widths; heights; aspect ratios; visual ages; documentary qualities.

The visual rhythm should feel curated rather than algorithmically
uniform.

22. JourneyMedia Data

Journey Media may use a small local data structure.

Example:

type JourneyMediaItem = { id: string; src: string; alt: string; width:
number; height: number; };

Optional fields should only be added when required.

Do not prematurely introduce:

dates; categories; captions; links; artwork IDs; exhibition IDs;

unless the visible experience actually uses them.

23. JourneyMedia Loop

If a seamless continuous loop is implemented, duplication of the visual
sequence for presentation purposes is acceptable.

Conceptually:

A B C D E \| A B C D E ← continuous movement ←

The duplicated visual sequence must not create duplicated semantic
content for assistive technologies.

Decorative duplicate content should be hidden appropriately.

The implementation technique may use CSS or GSAP depending on which
provides the cleanest and most performant solution.

The architectural document does not require one specific mechanism.

24. JourneyMedia Client Boundary

Continuous movement requires a client-side or CSS animation strategy.

If pure CSS provides the required experience and reduced-motion behavior
cleanly, JourneyMedia does not need to become a complex GSAP component.

If GSAP provides materially better control, a small client boundary may
be introduced.

The rest of ArtistJourney should remain server-rendered.

Do not convert the entire Journey section to a Client Component merely
because Journey Media moves.

25. JourneyMedia Future Variants

Future conceptual variants include:

image sequence cinematic sequence video

Do not implement all variants in v1.0.

The initial component boundary should simply avoid making future video
replacement unnecessarily destructive.

A future API may become:

`<JourneyMedia variant="sequence" />`{=html}

or:

`<JourneyMedia variant="video" />`{=html}

only when such variants actually exist.

26. JourneyMedia and Container

Narrative Journey content uses the normal Container.

Journey Media may deliberately escape that Container.

Recommended hierarchy:

```{=html}
<section>
```
`<Container>`{=html} Journey intro Journey milestones
`</Container>`{=html}

`<JourneyMedia />`{=html}

`<Container>`{=html} Journey closing thought `</Container>`{=html}
```{=html}
</section>
```
This preserves global alignment while allowing the memory sequence to
expand toward the viewport edges.

27. Motion Architecture

Artist follows the established Del Carmen motion philosophy:

restrained; scene-specific; scroll-position driven; once where
appropriate; no generic global reveal system; no scrub/parallax by
default; reduced-motion aware.

Artist should not introduce a universal Reveal component merely to
reduce repeated GSAP code.

The visual behavior of each scene is intentionally different.

28. Motion Component Pattern

Preferred architecture:

Server Section │ ├── semantic content ├── images └── small Client Motion
component

Example:

ArtistPractice.tsx ArtistPracticeMotion.tsx

The Server Component owns markup and content.

The Client Component owns animation initialization and cleanup.

This pattern follows the successful Home implementation while preserving
server rendering.

29. GSAP Lifecycle

Client motion components should:

use useLayoutEffect where initialization must occur before paint; scope
selectors to the section; use gsap.context; clean up using context
reversion; detect prefers-reduced-motion; clear initial
hidden/transformed states appropriately for reduced motion.

Conceptual pattern:

useLayoutEffect(() =\> { const ctx = gsap.context(() =\> { //
initialization // ScrollTriggers }, sectionRef);

return () =\> ctx.revert(); }, \[\]);

Exact animation values remain scene-specific.

30. Hydration-Safe Motion

Artist must incorporate the lesson established during Home development.

Animated content must not render visibly at its final state during SSR
and then flash into a hidden GSAP starting state after hydration.

For elements intentionally animated on entrance:

apply a scene-specific motion class; hide that class before motion
initialization when motion is permitted; establish matching initial GSAP
states; reveal through the intended animation; bypass hidden states
under reduced motion.

Conceptually:

@media (prefers-reduced-motion: no-preference) { .artist-hero-motion,
.artist-story-motion, .artist-philosophy-motion,
.artist-practice-motion, .artist-journey-motion, .artist-closing-motion
{ visibility: hidden; } }

The exact class strategy may be consolidated if implementation
demonstrates a cleaner approach without creating a generic motion
abstraction.

No visible hydration flash is acceptable.

31. Scroll Trigger Principle

Narrative information should reveal because the visitor reaches it.

Avoid a single long timeline such as:

trigger section → animate heading → wait → animate paragraph → wait →
animate image → wait → animate next paragraph

when the visitor has not physically reached those elements.

Prefer individual physical triggers for meaningful content groups.

Short timelines inside a currently reached group remain acceptable.

32. Hero Motion

Hero motion should be restrained.

Potential groups:

identity; title; supporting statement; portrait.

The exact reveal sequence should be designed during implementation.

Hero should not introduce elaborate cinematic animation before the
visitor can begin reading.

33. Artist Story Motion

Biography fragments and images should reveal according to physical
scroll position.

Because the section may interleave multiple blocks, each meaningful
group should be independently triggered.

Avoid animating the entire biography as one long timeline.

34. Philosophy Motion

Philosophy should use slower and quieter motion than more documentary
scenes.

Potential groups:

eyebrow; statement; artwork detail; text groups; final thought.

Motion should reinforce contemplation.

35. Practice Motion

Potential groups:

section introduction; primary Practice Media; body copy; material
detail; editorial pause; work-in-progress media; closing thought.

The statement:

This is where discipline and intuition meet.

should receive its own spatial and motion moment.

36. Journey Motion

Each milestone should reveal independently.

A milestone should not animate simply because the previous milestone
entered.

Possible internal milestone groups:

number / period; heading; text; archival image.

The teacher-memory moment may receive its own restrained reveal.

37. JourneyMedia Motion

Journey Media is an exception to the narrative motion rule.

Continuous environmental movement is permitted because it does not
determine access to required narrative information.

Movement should remain:

slow; linear or perceptually continuous; non-interruptive;
non-essential.

If the visitor prefers reduced motion, the sequence should become static
or otherwise substantially simplified.

38. Closing Motion

The closing should contain the least motion density.

Potential order:

eyebrow; title; supporting copy; final statement; artwork fragment; CTA.

These groups should remain connected to physical scroll progression.

The artwork fragment may use subtle opacity/scale behavior.

No parallax is required.

39. Responsive Implementation

Artist should use the existing project breakpoint system.

Do not introduce Artist-specific breakpoints unless a genuine
composition problem cannot be solved with the established responsive
system.

Desktop, tablet, and mobile should each be treated intentionally.

40. Desktop

Desktop may use:

asymmetric grids; controlled offsets; larger visual relationships;
alternating media/text alignment; selective viewport-edge media.

The normal Container remains the master alignment system.

41. Tablet

Tablet should receive deliberate layout decisions.

Implementation should test:

portrait/text balance; body-copy width; image scale; Practice
relationships; Journey milestone composition; Journey Media height and
density.

Do not rely solely on desktop styles collapsing automatically.

42. Mobile

Mobile should prioritize narrative order.

DOM order should already represent the correct reading sequence.

Avoid CSS-only visual rearrangement that creates a mismatch between
visual and semantic order.

Journey milestones become naturally sequential.

Practice should preserve the conceptual progression:

Environment → Material → Work

without forcing desktop asymmetry into narrow screens.

43. Accessibility

Artist implementation must provide:

semantic headings; logical heading hierarchy; meaningful image
alternative text; decorative image handling; keyboard-accessible links;
reduced-motion support; sufficient contrast; semantic reading order;
accessible video behavior if video is introduced.

Journey Media duplicate loop content must not be announced twice.

44. Performance

Artist is media-rich and should remain performance-conscious.

Implementation priorities:

optimize Hero image; use responsive image sizes; lazy-load below-fold
imagery; avoid unnecessary JavaScript; isolate Client Components; avoid
loading future video code before video exists; avoid preloading all
Journey Media unnecessarily; use appropriate production image
dimensions; prevent layout shift through known dimensions/aspect ratios.

Motion should not compromise scroll performance.

45. Video Performance --- Future

If video is introduced later:

provide poster imagery; avoid unnecessary preload; use appropriate
compression; avoid loading large desktop video on mobile when
unnecessary; provide fallback behavior; consider viewport-based loading;
preserve reduced-motion behavior.

Artist v1.0 does not require this infrastructure yet.

46. SEO Architecture

/artist requires page-level metadata.

Minimum requirements:

title; description; canonical URL; Open Graph title; Open Graph
description; Open Graph image.

The final implementation should use the canonical public artist display
name consistently.

Structured data may be introduced during the broader Phase 1 SEO
implementation.

Do not build a standalone Artist SEO framework.

47. Artwork Integration

Artist may visually reference artworks, but it should not duplicate
Artwork domain data unnecessarily.

If a closing artwork detail comes from an existing canonical Artwork,
the implementation should reuse the canonical Artwork data where
practical.

The closing CTA links to:

/artworks

Artist does not own artwork detail navigation or artwork archive logic.

48. LinkButton

The closing CTA should reuse the existing shared button system.

Conceptually:

`<LinkButton
  href="/artworks"
  variant="bronzeUnderline"
>`{=html} Explore the Works `</LinkButton>`{=html}

Do not create an Artist-specific CTA component.

49. Styling Responsibility

Global visual decisions remain in the canonical global styling/token
system.

Examples:

typography families; global colors; shared spacing tokens; reusable
bronze/gold behavior; global Container behavior.

Artist-specific composition values may remain local.

Examples:

Hero portrait size; Philosophy artwork offset; Practice image
proportions; Journey milestone spacing; Journey Media height; Closing
artwork crop.

Do not promote every local value into a design token.

50. No Premature Shared Components

The following should remain Artist-local initially:

PracticeMedia; JourneyMedia; Journey milestone renderer; teacher-memory
treatment; Artist-specific editorial image compositions.

If another domain later requires genuinely equivalent behavior,
extraction into shared/ can be evaluated then.

51. Implementation Sequence

Recommended construction order:

Step 01 --- Route and Composition Root

Create:

src/app/artist/page.tsx src/domains/artist/index.tsx

Verify /artist renders within the existing global application shell.

Step 02 --- Asset Preparation

Create the Artist production asset hierarchy.

Prepare and rename the initial approved imagery.

Do not optimize every possible archival image before it is selected for
use.

Step 03 --- Artist Hero

Implement:

composition; responsive behavior; typography; primary portrait; motion.

Approve Hero before moving deeper into the page.

Step 04 --- The Artist

Implement:

biography; contemporary/archival media; responsive editorial
relationships; motion. Step 05 --- Artistic Philosophy

Implement:

statement; artwork detail; spacious typography; final thought; motion.
Step 06 --- The Practice

Implement:

primary Practice Media; Environment → Material → Work hierarchy;
editorial pause; supporting process imagery; motion.

Initial Practice Media may remain image-only.

Step 07 --- The Journey

Implement:

introduction; five milestones; local milestone data; selected archival
media; teacher-memory placement if exact content is ready; milestone
motion. Step 08 --- Journey Media

Implement the initial photographic memory sequence.

Verify:

continuous movement; seamless behavior if looped; varied image
dimensions; responsive behavior; reduced-motion fallback; accessibility
of duplicated loop content; performance. Step 09 --- The Work

Implement:

closing statement; artwork presence; /artworks CTA; restrained motion.
Step 10 --- Responsive QA

Review intentionally at:

mobile; tablet; desktop; wide desktop.

Correct composition rather than merely overflow.

Step 11 --- Accessibility and Reduced Motion

Verify:

semantic order; headings; alt text; keyboard navigation; reduced motion;
Journey Media fallback. Step 12 --- Performance

Review:

image dimensions; sizes; priority usage; loading behavior; layout shift;
client bundle impact; GSAP cleanup. Step 13 --- SEO

Add or verify page metadata.

Structured data may be coordinated with the broader Phase 1 SEO pass.

Step 14 --- Production Build

Run the canonical production build:

npm run build -- --webpack

Resolve all:

TypeScript errors; lint/build issues; route issues; image issues;
hydration warnings. Step 15 --- Final Artist QA

Verify the complete narrative from Hero through Explore the Works.

Only after Artist passes final QA should the page be considered complete
for Phase 1.

52. Approval Workflow

Artist should continue using the modular approval workflow established
during Home.

Recommended approval checkpoints:

Hero ↓ approved

The Artist ↓ approved

Philosophy ↓ approved

Practice ↓ approved

Journey ↓ approved

Journey Media ↓ approved

The Work ↓ approved

Responsive / Accessibility / Performance ↓ approved

Artist Page Complete

Once a scene is approved, later work should not casually modify its
composition.

Cross-page fixes should be evaluated carefully before touching frozen
scenes.

53. MVP Boundaries

Artist v1.0 should implement what the approved page currently requires.

Do not build:

CMS; Artist database; exhibition database; awards database; generalized
timeline engine; generalized carousel engine; generalized media
framework; AI video generation pipeline; video CMS; custom streaming
infrastructure; immersive 3D Artist environment.

These may become valid future requirements.

They are not current requirements.

54. Future Evolution

The architecture intentionally leaves room for:

Practice static image → short process video → richer cinematic process
media Journey Media photographic sequence → cinematic sequence → short
Artist film Journey Data local editorial milestones → richer historical
content source

only if later product phases require it.

Future evolution should occur from demonstrated requirements rather than
anticipated complexity.

55. Acceptance Criteria

Artist implementation architecture is correctly represented when:

/artist is owned by the Artist domain. The App Router entry remains
minimal. Artist sections remain Server Components by default. Client
boundaries exist only where browser behavior requires them. Artist does
not create unnecessary infrastructure layers. The normal Container
remains authoritative for editorial alignment. Artist-specific
components remain local until genuine reuse exists. Approved editorial
content remains canonical. Media assets are organized by narrative
responsibility. Practice Media can evolve toward video without
redesigning the scene. Journey milestones use lightweight local
structured data. Journey does not create a global timeline model.
Journey Media remains independent from Artwork Gallery components.
Journey Media can escape the Container intentionally. Journey Media
supports the approved photographic sequence for v1.0. Future video
compatibility does not create speculative implementation complexity.
Narrative motion remains scroll-position driven. Continuous movement is
limited to environmental media where appropriate. Motion initialization
prevents hydration flash. Reduced-motion behavior is supported. Semantic
DOM order remains correct across responsive layouts. Existing shared
systems such as Container and LinkButton are reused. Artist does not
duplicate Navigation, Artwork, or other domain responsibilities. Media
loading remains performance-conscious. The closing CTA leads to
/artworks. The production build completes successfully before Artist is
considered finished. 56. Canonical Implementation Decisions

The following decisions become canonical once this document is approved:

Route: /artist. Route entry: src/app/artist/page.tsx. Experience
ownership: src/domains/artist/. Artist is an editorial domain without
persistence infrastructure in v1.0. Artist composition root owns the
six-scene order. Server Components are the default. Motion is isolated
into small Client Components. Container remains the primary editorial
grid. Artist content remains local/static for v1.0. Artist assets live
under public/artist/. Assets are organized by narrative role. Practice
owns a local PracticeMedia responsibility. Journey owns a local
JourneyMedia responsibility. Practice and Journey media boundaries
remain future-video compatible without speculative APIs. Journey
milestones use local structured data. No global milestone/timeline model
is introduced. Journey Media does not reuse Artwork Gallery. Journey
Media may escape the Container. The initial Journey Media implementation
is a slow right-to-left photographic sequence. Narrative motion is
physical-scroll-position driven. Journey Media may use continuous
environmental motion. useLayoutEffect / scoped GSAP lifecycle is
preferred for hydration-sensitive motion. Hydration flash prevention is
required. Reduced motion is required. No generic Reveal abstraction is
introduced. Existing LinkButton is reused for the closing CTA.
Artist-specific visual values remain local unless genuinely global.
Implementation proceeds scene by scene with approval checkpoints. Artist
v1.0 does not require CMS, database, generalized media framework, or AI
video infrastructure. 57. Related Documents

This document should be read together with:

docs/pages/artist/artist-specification.md --- v1.2
docs/pages/artist/artist-wireframe.md --- v1.2 canonical Design Tokens
documentation canonical Project Memory canonical Roadmap canonical
architectural/governance documentation

If implementation decisions conflict with higher-authority project
architecture or governance documents, the conflict should be resolved
explicitly rather than silently overridden.

## 58. Final Implementation Record

**Completion Date:** 2026-09-01\
**Implementation Status:** COMPLETE / APPROVED / FROZEN

Artist Page v1.0 has completed the modular implementation and approval
cycle.

The final production experience contains the canonical six-scene
sequence:

1.  Artist Hero
2.  The Artist
3.  Artistic Philosophy
4.  The Practice
5.  The Journey
6.  The Work

The implemented page preserves the approved editorial, spatial,
responsive, accessibility, and motion principles.

### Final Shared-System Decisions

-   Global Navigation remains owned by the root application layout.
-   Artist does not render a duplicate Navigation.
-   `/artist` maps to the existing **About** navigation state.
-   Footer is reused from `src/shared/layout/footer/` and remains
    page-composed rather than forced globally.
-   Standard editorial alignment continues to use the shared
    `Container`.

### Final Journey Interaction

The Journey desktop experience uses a pinned, physical-scroll-driven
GSAP timeline.

Its final navigation system is a restrained vertical Journey Navigator
positioned at the right edge of the scene.

The navigator:

-   represents the five canonical milestones;
-   keeps the active milestone visually distinct in Primary Gold;
-   supports direct click navigation to milestone resting positions;
-   synchronizes correctly while scrolling both forward and backward;
-   uses GSAP ScrollTrigger snapping to prevent the experience from
    resting unintentionally in incomplete transition states;
-   snaps to real timeline milestone anchors rather than mathematically
    equal page percentages;
-   uses pointer-proximity magnification inspired by dock-style
    interaction;
-   reveals milestone dates as peripheral navigation information;
-   keeps the rail and dates outside the primary editorial copy column;
-   remains desktop-only;
-   does not replace or alter the natural mobile/tablet reading flow.

The Journey Navigator is an Artist-local interaction and must not be
promoted into a generalized timeline/navigation framework without
demonstrated cross-domain reuse.

### Responsive Final State

Desktop preserves the immersive pinned Journey experience.

Tablet and mobile preserve natural document flow and do not depend on
pinned navigation.

Approved scene-specific responsive adjustments remain local where they
are required by composition.

### Motion Final State

Narrative motion remains subordinate to content.

Physical scroll position remains the authority for narrative disclosure.

Scroll snapping is permitted within the desktop Journey because it
completes an already-entered milestone presentation rather than
revealing narrative content independently of user scroll.

Reduced-motion behavior remains mandatory.

### Change Control

Artist is now frozen.

Future changes should be limited to:

-   verified bugs;
-   accessibility defects;
-   production compatibility issues;
-   explicitly approved Artist experience revisions.

Preference-only redesign should not reopen the completed Artist
experience.

------------------------------------------------------------------------

## 59. Document Status

**Version:** 1.1\
**Status:** 🟢 Approved / Complete / Frozen\
**Last Updated:** 2026-09-01

This document is the canonical technical reference for the completed
Artist Page v1.0 implementation.

Material architectural or experiential changes require an explicit
revision and a new document version.
