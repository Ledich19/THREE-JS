 varying vec3 v_position;
      varying vec2 vUv;
			uniform float blend;
      uniform sampler2D original;
      uniform sampler2D cry;

      void main(void) {
        vec2 st = v_position.xy;
        float koef = clamp(v_position.z/60.,0.,1.);
        vec3 color1 = vec3(0.5,0.5,1.);
        vec3 color2 = vec3(0.,0.,1.);
        vec3 color3 = mix(color1,color2,koef);

        vec2 grid = abs(fract(st/4. - 0.5) - 0.5) / fwidth(st/4.);
          float color = min(grid.x, grid.y);
          gl_FragColor = vec4(color3,1. - color);
					gl_FragColor = vec4(0.,1.,0.0,1.);

					float stepBland = clamp(v_position.x + v_position.y+3.*blend -1.,0.,1.);
					vec4 originalC = texture2D(original, vUv);
					vec4 cryC = texture2D(cry, vUv);
					vec4 result = originalC*(1.-stepBland) + cryC*stepBland;
					gl_FragColor = result;
      }