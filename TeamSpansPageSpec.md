# Team Spans Page - Specification

## Overview
Create a responsive grid layout that displays team members grouped by their roles in contiguous spans. Each span consists of a role header followed by associated team member cards, with multiple spans potentially appearing on the same row if space allows.

## Components

### Span Components
Create the following Astro components in `/src/components/team/`:
1. `ManagingPartnersSpan.astro`
2. `VerticalPartnersSpan.astro`
3. `TrusteesSpan.astro`
4. `AdvisoryBoardSpan.astro`
5. `FoundingTeamSpan.astro`
6. `ActiveFellowsSpan.astro`
7. `PhilanthropiesSpan.astro`

### Page Layout
- Single responsive grid container
- Grid items flow from left to right
- No forced line breaks between spans
- Responsive column count based on viewport width

## Requirements

### Grid Behavior
- **Contiguous Spans**: Each role group must maintain its cards together in a single span
- **Horizontal Flow**: Spans should flow left-to-right, top-to-bottom
- **Responsive**: Adjust number of columns based on viewport width
- **No Gaps**: Continuous flow without unnecessary white space between spans

### Span Structure
Each span component should:
1. Display a role title as a header
2. Show all team members for that role as cards
3. Maintain consistent styling across all spans
4. Be self-contained and independent of other spans

### Visual Design
- **Role Header**: Prominently displayed above the first card of each span
- **Cards**: Uniform styling with consistent spacing
- **Responsive**: Cards should resize appropriately for different screen sizes
- **Accessibility**: Proper heading hierarchy and ARIA attributes

## Implementation Notes
1. Use CSS Grid for the main layout
2. Each span should be a self-contained component
3. Maintain consistent spacing and alignment
4. Ensure proper responsive behavior
5. Optimize for performance with lazy loading where appropriate

## Example Structure
```astro
<main class="team-grid">
  <!-- Managing Partners -->
  <div class="team-span">
    <h2 class="role-header">Managing Partners</h2>
    <div class="person-cards">
      <!-- Person cards go here -->
    </div>
  </div>
  
  <!-- Next span continues in the same row if space allows -->
  <div class="team-span">
    <h2 class="role-header">Advisory Board</h2>
    <div class="person-cards">
      <!-- Person cards go here -->
    </div>
  </div>
</main>
```

## Acceptance Criteria
- [ ] All team members are displayed in their respective role groups
- [ ] Grid flows continuously without unnecessary breaks
- [ ] Layout is fully responsive
- [ ] No PersonCard is unreasonably large.
- [ ] All spans maintain consistent styling
- [ ] Performance is optimized for all device sizes