# `SvgIcon`

_SvgIcon is a reusable component which turns **icomoon** icons into configurable react elements._

## Usage

    <SvgIcon
        id={id}
        size={24}
        name={"mi-icon-dashboard"}
        color={colors['blue']}
    />

## Props & States

### PROPS

| Name        | Type   | Default          | Required | Desc                         |
| ----------- | ------ | ---------------- | -------- | ---------------------------- |
| `id`        | String | `null`           | -        | -                            |
| `className` | String | `""`             | -        | -                            |
| `size`      | Number | -                | ✔        | icon size (width and height) |
| `name`      | String | -                | ✔        | icomoon name                 |
| `color`     | String | `"currentColor"` | -        | svg fill                     |
