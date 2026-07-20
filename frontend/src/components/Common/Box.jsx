import React from 'react';

/**
 * Box component - A versatile layout container that wraps content.
 * Resolves standard layout, spacing, and styling properties into Bootstrap utility classes.
 */
export default function Box({
  children,
  as: Component = 'div',
  className = '',
  id,
  style = {},
  // Spacing (0-5, auto)
  p, px, py, pt, pb, ps, pe,
  m, mx, my, mt, mb, ms, me,
  // Flexbox properties
  display, // flex, inline-flex, block, inline-block, grid, inline, none
  flexDirection, // row, column, row-reverse, column-reverse
  alignItems, // start, end, center, baseline, stretch
  justifyContent, // start, end, center, between, around, evenly
  gap, // 0-5
  flex, // grow-0, grow-1, shrink-0, shrink-1, fill
  // Box styling & sizing
  bg, // primary, secondary, success, danger, warning, info, light, dark, white, transparent
  text, // primary, muted, white, dark, success, danger, warning
  border, // boolean or string (e.g. 'top', 'bottom', '0', etc.)
  borderColor, // primary, secondary, border-color, etc.
  rounded, // boolean or string (e.g. '0', 'circle', 'pill', 'lg', etc.)
  shadow, // boolean or string (e.g. 'sm', 'lg', 'none', etc.)
  width, // 25, 50, 75, 100, auto
  height, // 25, 50, 75, 100, auto
  ...props
}) {
  const classes = [];

  // Spacing
  if (p !== undefined) classes.push(`p-${p}`);
  if (px !== undefined) classes.push(`px-${px}`);
  if (py !== undefined) classes.push(`py-${py}`);
  if (pt !== undefined) classes.push(`pt-${pt}`);
  if (pb !== undefined) classes.push(`pb-${pb}`);
  if (ps !== undefined) classes.push(`ps-${ps}`);
  if (pe !== undefined) classes.push(`pe-${pe}`);

  if (m !== undefined) classes.push(`m-${m}`);
  if (mx !== undefined) classes.push(`mx-${mx}`);
  if (my !== undefined) classes.push(`my-${my}`);
  if (mt !== undefined) classes.push(`mt-${mt}`);
  if (mb !== undefined) classes.push(`mb-${mb}`);
  if (ms !== undefined) classes.push(`ms-${ms}`);
  if (me !== undefined) classes.push(`me-${me}`);

  // Layout & Flexbox
  if (display) classes.push(`d-${display}`);
  if (flexDirection) classes.push(`flex-${flexDirection}`);
  if (alignItems) classes.push(`align-items-${alignItems}`);
  if (justifyContent) classes.push(`justify-content-${justifyContent}`);
  if (gap !== undefined) classes.push(`gap-${gap}`);
  if (flex !== undefined) classes.push(`flex-${flex}`);

  // Colors & Styles
  if (bg) classes.push(`bg-${bg}`);
  if (text) classes.push(`text-${text}`);

  if (border === true) {
    classes.push('border');
  } else if (typeof border === 'string') {
    classes.push(border.includes('border') ? border : `border-${border}`);
  }

  if (borderColor) classes.push(`border-${borderColor}`);

  if (rounded === true) {
    classes.push('rounded');
  } else if (typeof rounded === 'string') {
    classes.push(rounded.includes('rounded') ? rounded : `rounded-${rounded}`);
  }

  if (shadow === true) {
    classes.push('custom-shadow'); // Use Freedash specialized shadow
  } else if (typeof shadow === 'string') {
    classes.push(shadow === 'custom' ? 'custom-shadow' : `shadow-${shadow}`);
  }

  // Dimension utilities
  if (width) classes.push(`w-${width}`);
  if (height) classes.push(`h-${height}`);

  const resolvedClassName = [classes.join(' '), className].filter(Boolean).join(' ');

  return (
    <Component id={id} className={resolvedClassName} style={style} {...props}>
      {children}
    </Component>
  );
}
