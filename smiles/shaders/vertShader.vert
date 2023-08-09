varying vec2 vUv;
      varying vec3 vecPos;
      varying vec3 v_position;
      uniform float time;
      uniform float blend;
			uniform sampler2D original;
			uniform sampler2D cry;
      
      void main() {
				vUv = uv;
        v_position = position.xyz; 
				float roundBland = sin(3.1415926*blend);
				float stepBland = clamp(v_position.x + v_position.y+3.*blend -1.,0.,1.);

				float originalR = texture2D(original, vUv).r;
				float cryR = texture2D(cry, vUv).r;
				v_position.z = 0.2*mix(originalR,cryR,stepBland) +roundBland* 0.1*sin(v_position.x * 10. + time/10.); 

				
				v_position.x = v_position.x + roundBland * 0.3 * sin(v_position.x+v_position.y+blend);
				v_position.y = v_position.y + roundBland * 0.3 * sin(v_position.x+v_position.y+blend);

        vecPos = (modelViewMatrix * vec4(v_position, 1.0)).xyz;
        gl_Position = projectionMatrix * vec4(vecPos, 1.0);
      }