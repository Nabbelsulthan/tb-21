
// import { useRef, useState } from "react";
// import "./App.css";

// const log = (...args) => console.log(
//   `[TB21 ${new Date().toISOString()}]`,
//   ...args
// );

// export default function App() {
//   const [deviceName, setDeviceName] = useState("");
//   const [status, setStatus] = useState("Not connected");
//   const [services, setServices] = useState([]);
//   const [busy, setBusy] = useState(false);
//   const deviceRef = useRef(null);
//   const serverRef = useRef(null);

//   const [volume, setVolume] = useState(0);
//   const [maxVolume, setMaxVolume] = useState(15);
//   const [commandStatus, setCommandStatus] = useState(
//     "RCSP encoder not implemented"
//   );

//   const supported =
//     typeof navigator !== "undefined" &&
//     !!navigator.bluetooth;

//   //   async function scanAndConnect() {
//   //     if (!supported) {
//   //       log("ERROR: Web Bluetooth unavailable", {
//   //         secureContext: window.isSecureContext,
//   //         userAgent: navigator.userAgent,
//   //       });
//   //       setStatus("Use Chrome in a secure context");
//   //       return;
//   //     }

//   //     setBusy(true);
//   //     setServices([]);
//   //     log("Starting BLE device selection");

//   //     try {
//   //       // No guessed service UUIDs: let the user select the device.
//   //       const device = await navigator.bluetooth.requestDevice({
//   //         acceptAllDevices: true,
//   //         optionalServices: [
//   //           "generic_access",
//   //           "generic_attribute",
//   //           "battery_service",
//   //         ],
//   //       });

//   //       deviceRef.current = device;
//   //       setDeviceName(device.name || "(unnamed device)");

//   //       log("Device selected", {
//   //         name: device.name,
//   //         id: device.id,
//   //         gattConnected: device.gatt?.connected,
//   //       });

//   //       device.addEventListener("gattserverdisconnected", () => {
//   //         log("GATT disconnected", device.name);
//   //         setStatus("Disconnected");
//   //         setServices([]);
//   //       });

//   //       setStatus("Connecting…");
//   //       const server = await device.gatt.connect();
//   //       serverRef.current = server;

//   //       log("GATT connected", {
//   //         connected: server.connected,
//   //       });
//   //       setStatus("Connected; discovering services…");

//   //       const discovered = await server.getPrimaryServices();

//   //       log("Primary services discovered", discovered.length);

//   //       const result = [];

//   //       for (const service of discovered) {
//   //         log("Service", service.uuid);

//   //         const characteristics =
//   //           await service.getCharacteristics();

//   //         const chars = [];

//   //         for (const ch of characteristics) {
//   //           const info = {
//   //             uuid: ch.uuid,
//   //             properties: {
//   //               read: ch.properties.read,
//   //               write: ch.properties.write,
//   //               writeWithoutResponse:
//   //                 ch.properties.writeWithoutResponse,
//   //               notify: ch.properties.notify,
//   //               indicate: ch.properties.indicate,
//   //             },
//   //           };

//   //           log("Characteristic", info);
//   //           chars.push(info);

//   //           // Subscribe only to characteristics that explicitly
//   //           // advertise notification support.
//   //           if (ch.properties.notify) {
//   //             try {
//   //               await ch.startNotifications();
//   //               ch.addEventListener(
//   //                 "characteristicvaluechanged",
//   //                 (event) => {
//   //                   const value =
//   //                     event.target.value;
//   //                   const bytes = Array.from(
//   //                     new Uint8Array(
//   //                       value.buffer,
//   //                       value.byteOffset,
//   //                       value.byteLength
//   //                     )
//   //                   );

//   //                   log("Notification received", {
//   //                     service: service.uuid,
//   //                     characteristic: ch.uuid,
//   //                     bytes,
//   //                     hex: bytes.map(
//   //                       (b) => b.toString(16).padStart(2, "0")
//   //                     ).join(" "),
//   //                   });
//   //                 }
//   //               );
//   //               log("Notifications enabled", ch.uuid);
//   //             }

//   //             // catch (error) {
//   //             //   log("Notification setup failed", {
//   //             //     uuid: ch.uuid,
//   //             //     error: error.message,
//   //             //   });
//   //             // }


//   //  catch (error) {
//   //             if (
//   //               error.name === "NotFoundError" &&
//   //               /cancel/i.test(error.message)
//   //             ) {
//   //               log("Bluetooth chooser cancelled by user");
//   //               setStatus("Selection cancelled — tap Scan & Connect to retry");
//   //             } else {
//   //               log("Bluetooth operation failed", {
//   //                 name: error.name,
//   //                 message: error.message,
//   //                 stack: error.stack,
//   //               });
//   //               setStatus(`${error.name}: ${error.message}`);
//   //             }
//   //           } finally {
//   //             setBusy(false);
//   //           }

//   //         }
//   //       }

//   //       result.push({
//   //         uuid: service.uuid,
//   //         characteristics: chars,
//   //       });
//   //     }

//   //       setServices(result);
//   //     setStatus(
//   //       `Connected — found ${result.length} services`
//   //     );
//   //     log("Discovery complete", result);
//   //   } catch (error) {
//   //     log("Bluetooth operation failed", {
//   //       name: error.name,
//   //       message: error.message,
//   //       stack: error.stack,
//   //     });
//   //     setStatus(`${error.name}: ${error.message}`);
//   //   } finally {
//   //     setBusy(false);
//   //   }
//   // }



  
//   async function scanAndConnect() {
//     if (!supported) {
//       log("ERROR: Web Bluetooth unavailable", {
//         secureContext: window.isSecureContext,
//         userAgent: navigator.userAgent,
//       });
//       setStatus("Use Chrome in a secure context");
//       return;
//     }

//     setBusy(true);
//     setServices([]);
//     setStatus("Selecting device…");
//     log("Starting BLE device selection");

//     try {
//       const device = await navigator.bluetooth.requestDevice({
//         filters: [{ name: "TB21-APP" }],
//         optionalServices: [
//           "generic_access",
//           "generic_attribute",
//           "battery_service",
//           "0000ae00-0000-1000-8000-00805f9b34fb",
//         ],
//       });

//       deviceRef.current = device;
//       setDeviceName(device.name || "(unnamed device)");

//       log("Device selected", {
//         name: device.name,
//         id: device.id,
//       });

//       device.addEventListener(
//         "gattserverdisconnected",
//         () => {
//           log("GATT disconnected", device.name);
//           serverRef.current = null;
//           setStatus("Disconnected");
//           setServices([]);
//         }
//       );

//       setStatus("Connecting…");

//       const server = await device.gatt.connect();
//       serverRef.current = server;

//       log("GATT connected", {
//         connected: server.connected,
//       });

//       setStatus("Discovering services…");

//       const discovered = await server.getPrimaryServices();

//       log(
//         "Primary services discovered",
//         discovered.map((service) => service.uuid)
//       );

//       const result = [];

//       for (const service of discovered) {
//         log("Inspecting service", service.uuid);

//         const characteristics =
//           await service.getCharacteristics();

//         const chars = [];

//         for (const ch of characteristics) {
//           const info = {
//             uuid: ch.uuid,
//             properties: {
//               read: ch.properties.read,
//               write: ch.properties.write,
//               writeWithoutResponse:
//                 ch.properties.writeWithoutResponse,
//               notify: ch.properties.notify,
//               indicate: ch.properties.indicate,
//             },
//           };

//           chars.push(info);
//           log("Characteristic discovered", info);

//           if (ch.properties.notify) {
//             try {
//               await ch.startNotifications();

//               ch.addEventListener(
//                 "characteristicvaluechanged",
//                 (event) => {
//                   const value = event.target.value;
//                   const bytes = Array.from(
//                     new Uint8Array(
//                       value.buffer,
//                       value.byteOffset,
//                       value.byteLength
//                     )
//                   );

//                   log("Notification received", {
//                     service: service.uuid,
//                     characteristic: ch.uuid,
//                     bytes,
//                     hex: bytes
//                       .map((b) =>
//                         b.toString(16).padStart(2, "0")
//                       )
//                       .join(" "),
//                   });
//                 }
//               );

//               log("Notifications enabled", ch.uuid);
//             } catch (error) {
//               log("Notification setup failed", {
//                 uuid: ch.uuid,
//                 name: error.name,
//                 message: error.message,
//               });
//             }
//           }
//         }

//         result.push({
//           uuid: service.uuid,
//           characteristics: chars,
//         });
//       }

//       setServices(result);
//       setStatus(
//         `Connected — found ${result.length} services`
//       );

//       log("Discovery complete", result);
//     } catch (error) {
//       if (
//         error.name === "NotFoundError" &&
//         /cancel/i.test(error.message)
//       ) {
//         setStatus("Selection cancelled");
//         log("User cancelled device selection");
//       } else {
//         setStatus(`${error.name}: ${error.message}`);
//         log("Bluetooth operation failed", {
//           name: error.name,
//           message: error.message,
//           stack: error.stack,
//         });
//       }
//     } finally {
//       setBusy(false);
//     }
//   }


//   async function readCharacteristic(serviceUUID, charUUID) {
//     try {
//       const device = deviceRef.current;
//       if (!device?.gatt?.connected) {
//         throw new Error("Connect to the device first");
//       }

//       const service =
//         await serverRef.current.getPrimaryService(
//           serviceUUID
//         );
//       const characteristic =
//         await service.getCharacteristic(charUUID);

//       if (!characteristic.properties.read) {
//         throw new Error("Characteristic is not readable");
//       }

//       const value = await characteristic.readValue();
//       const bytes = Array.from(
//         new Uint8Array(
//           value.buffer,
//           value.byteOffset,
//           value.byteLength
//         )
//       );

//       log("Read successful", {
//         serviceUUID,
//         charUUID,
//         bytes,
//       });
//     } catch (error) {
//       log("Read failed", error);
//       setStatus(error.message);
//     }
//   }

//   function changeVolume(delta) {
//   const next = Math.max(
//     0,
//     Math.min(maxVolume, volume + delta)
//   );

//   if (next === volume) {
//     log("Volume limit reached", { volume, maxVolume });
//     return;
//   }

//   log("Volume requested", {
//     current: volume,
//     requested: next,
//     maxVolume,
//   });

//   setCommandStatus(
//     "Volume command prepared; RCSP transport required"
//   );

//   // Do not write to AE01 until the complete RCSP packet
//   // encoder and command-response handling are implemented.
// }

//   function disconnect() {
//     log("Disconnect requested");
//     if (deviceRef.current?.gatt?.connected) {
//       deviceRef.current.gatt.disconnect();
//     }
//     serverRef.current = null;
//     setServices([]);
//     setStatus("Disconnected");
//     setDeviceName("");
//   }

//   return (
//     <main className="app">
//       <header>
//         <p className="eyebrow">BLUETOOTH LAB</p>
//         <h1>TB-21 Controller</h1>
//         <p>BLE discovery and protocol diagnostics</p>
//       </header>

//       <section className="panel">
//         <div className="status">
//           <span className="dot" />
//           <span>{status}</span>
//         </div>

//         <p>Device: {deviceName || "Not selected"}</p>
//         <p className="muted">
//           Secure context:{" "}
//           {String(
//             typeof window !== "undefined" &&
//             window.isSecureContext
//           )}
//         </p>

//         <button
//           onClick={scanAndConnect}
//           disabled={busy}
//         >
//           {busy ? "Working…" : "Scan & Connect"}
//         </button>

//         <button
//           className="secondary"
//           onClick={disconnect}
//         >
//           Disconnect
//         </button>
//       </section>

//       <section className="panel">
//         <h2>Volume test</h2>
//         <p className="muted">
//           Volume commands are disabled until we identify
//           the device protocol and correct command format.
//         </p>

//         <div className="volume-controls">
//           <button disabled>− Volume</button>
//           <button disabled>+ Volume</button>
//         </div>
//       </section>

//       <section className="panel">
//         <h2>GATT services</h2>

//         {services.length === 0 && (
//           <p className="muted">
//             Connect to inspect discovered services.
//           </p>
//         )}

//         {services.map((service) => (
//           <article className="service" key={service.uuid}>
//             <strong>{service.uuid}</strong>

//             {service.characteristics.map((ch) => (
//               <div className="characteristic" key={ch.uuid}>
//                 <code>{ch.uuid}</code>
//                 <p>
//                   {Object.entries(ch.properties)
//                     .filter(([, enabled]) => enabled)
//                     .map(([name]) => name)
//                     .join(", ") || "No exposed properties"}
//                 </p>

//                 {ch.properties.read && (
//                   <button
//                     className="secondary"
//                     onClick={() =>
//                       readCharacteristic(
//                         service.uuid,
//                         ch.uuid
//                       )
//                     }
//                   >
//                     Read value
//                   </button>
//                 )}
//               </div>
//             ))}
//           </article>
//         ))}
//       </section>

//       <p className="footer">
//         Open DevTools → Console on desktop to inspect logs.
//         On Android, use remote debugging from desktop Chrome.
//       </p>
//     </main>
//   );
// }





import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const RCSP_SERVICE = "0000ae00-0000-1000-8000-00805f9b34fb";
const RCSP_WRITE = "0000ae01-0000-1000-8000-00805f9b34fb";
const RCSP_NOTIFY = "0000ae02-0000-1000-8000-00805f9b34fb";

const log = (message, details = undefined) => {
  const prefix = `[TB21 ${new Date().toISOString()}]`;
  if (details === undefined) console.log(prefix, message);
  else console.log(prefix, message, details);
};

const toHex = (bytes) =>
  Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join(" ");

export default function App() {
  const [deviceName, setDeviceName] = useState("");
  const [status, setStatus] = useState("Not connected");
  const [services, setServices] = useState([]);
  const [busy, setBusy] = useState(false);
  const [volume, setVolume] = useState(0);
  const [maxVolume, setMaxVolume] = useState(15);
  const [commandStatus, setCommandStatus] = useState(
    "Waiting for RCSP protocol implementation"
  );
  const [logs, setLogs] = useState([]);

  const deviceRef = useRef(null);
  const serverRef = useRef(null);
  const characteristicsRef = useRef(new Map());
  const notificationHandlersRef = useRef(new Map());
  const connectingRef = useRef(false);

  const supported =
    typeof navigator !== "undefined" &&
    "bluetooth" in navigator;

  const addLog = useCallback((message, details) => {
    log(message, details);

    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      message,
      details:
        details === undefined
          ? ""
          : typeof details === "string"
            ? details
            : JSON.stringify(details),
    };

    setLogs((previous) => [...previous.slice(-99), entry]);
  }, []);

  const handleDisconnect = useCallback(() => {
    addLog("Bluetooth GATT disconnected");
    serverRef.current = null;
    characteristicsRef.current.clear();
    setServices([]);
    setDeviceName("");
    setStatus("Disconnected");
    setCommandStatus("Reconnect to the amplifier");
  }, [addLog]);

  async function scanAndConnect() {
    if (connectingRef.current || busy) return;

    if (!supported || !window.isSecureContext) {
      const message =
        "Web Bluetooth requires a supported browser and HTTPS.";

      addLog("Bluetooth unavailable", {
        supported,
        secureContext: window.isSecureContext,
        userAgent: navigator.userAgent,
      });

      setStatus(message);
      return;
    }

    connectingRef.current = true;
    setBusy(true);
    setServices([]);
    characteristicsRef.current.clear();
    setStatus("Opening Bluetooth device picker…");

    addLog("Starting Bluetooth device selection");

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "TB21-APP" }],
        optionalServices: [
          "generic_access",
          "generic_attribute",
          "battery_service",
          RCSP_SERVICE,
        ],
      });

      deviceRef.current = device;
      setDeviceName(device.name || "(unnamed device)");

      addLog("Device selected", {
        name: device.name,
        id: device.id,
      });

      device.removeEventListener(
        "gattserverdisconnected",
        handleDisconnect
      );

      device.addEventListener(
        "gattserverdisconnected",
        handleDisconnect
      );

      setStatus("Connecting to GATT…");

      const server = await device.gatt.connect();
      serverRef.current = server;

      addLog("GATT connected", {
        connected: server.connected,
      });

      setStatus("Discovering GATT services…");

      const discovered = await server.getPrimaryServices();
      const result = [];

      addLog(
        "Primary services discovered",
        discovered.map((service) => service.uuid)
      );

      for (const service of discovered) {
        addLog("Inspecting service", service.uuid);

        const characteristics =
          await service.getCharacteristics();

        const items = [];

        for (const characteristic of characteristics) {
          const info = {
            uuid: characteristic.uuid,
            properties: {
              read: characteristic.properties.read,
              write: characteristic.properties.write,
              writeWithoutResponse:
                characteristic.properties.writeWithoutResponse,
              notify: characteristic.properties.notify,
              indicate: characteristic.properties.indicate,
            },
          };

          items.push(info);

          characteristicsRef.current.set(
            characteristic.uuid,
            characteristic
          );

          addLog("Characteristic discovered", {
            service: service.uuid,
            ...info,
          });

          if (
            characteristic.properties.notify ||
            characteristic.properties.indicate
          ) {
            try {
              await characteristic.startNotifications();

              const handler = (event) => {
                const value = event.target.value;
                const bytes = new Uint8Array(
                  value.buffer,
                  value.byteOffset,
                  value.byteLength
                );

                addLog("Notification received", {
                  service: service.uuid,
                  characteristic: characteristic.uuid,
                  bytes: Array.from(bytes),
                  hex: toHex(bytes),
                });
              };

              characteristic.addEventListener(
                "characteristicvaluechanged",
                handler
              );

              notificationHandlersRef.current.set(
                characteristic.uuid,
                handler
              );

              addLog("Notifications enabled", characteristic.uuid);
            } catch (error) {
              addLog("Notification setup failed", {
                uuid: characteristic.uuid,
                name: error.name,
                message: error.message,
              });
            }
          }
        }

        result.push({
          uuid: service.uuid,
          characteristics: items,
        });
      }

      setServices(result);

      const rcspFound = result.some(
        (service) => service.uuid.toLowerCase() === RCSP_SERVICE
      );

      const writeFound = characteristicsRef.current.has(RCSP_WRITE);
      const notifyFound = characteristicsRef.current.has(RCSP_NOTIFY);

      addLog("RCSP candidate inspection", {
        serviceFound: rcspFound,
        writeCharacteristicFound: writeFound,
        notificationCharacteristicFound: notifyFound,
      });

      setStatus(
        `Connected — ${result.length} GATT service(s) discovered`
      );

      setCommandStatus(
        rcspFound && writeFound && notifyFound
          ? "RCSP transport candidates found; packet encoder still required"
          : "Inspect service discovery logs for the device protocol"
      );

      addLog("Discovery complete", result);
    } catch (error) {
      if (error.name === "NotFoundError") {
        addLog("Device selection cancelled or no device selected");
        setStatus("Selection cancelled — try again");
      } else {
        addLog("Bluetooth operation failed", {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });

        setStatus(`${error.name}: ${error.message}`);
      }
    } finally {
      connectingRef.current = false;
      setBusy(false);
    }
  }

  async function readCharacteristic(serviceUUID, charUUID) {
    try {
      if (!serverRef.current?.connected) {
        throw new Error("Connect to the amplifier first");
      }

      const service =
        await serverRef.current.getPrimaryService(serviceUUID);

      const characteristic =
        await service.getCharacteristic(charUUID);

      if (!characteristic.properties.read) {
        throw new Error("This characteristic does not support reads");
      }

      const value = await characteristic.readValue();
      const bytes = new Uint8Array(
        value.buffer,
        value.byteOffset,
        value.byteLength
      );

      addLog("Characteristic read", {
        serviceUUID,
        charUUID,
        bytes: Array.from(bytes),
        hex: toHex(bytes),
      });
    } catch (error) {
      addLog("Characteristic read failed", {
        name: error.name,
        message: error.message,
      });

      setStatus(error.message);
    }
  }

  function changeVolume(delta) {
    const next = Math.max(0, Math.min(maxVolume, volume + delta));

    if (next === volume) {
      addLog("Volume limit reached", { volume, maxVolume });
      return;
    }

    addLog("Volume change requested", {
      currentVolume: volume,
      requestedVolume: next,
    });

    setCommandStatus(
      "Not sent: the RCSP command encoder has not been implemented"
    );

    /*
      IMPORTANT:
      Do not write the raw volume byte directly to AE01.
      The complete RCSP command, framing, and any required
      authentication must be implemented first.
    */
  }

  function disconnect() {
    addLog("Disconnect requested");

    const device = deviceRef.current;

    if (device?.gatt?.connected) {
      device.gatt.disconnect();
    } else {
      handleDisconnect();
    }
  }

  function clearLogs() {
    setLogs([]);
    console.clear();
    log("Diagnostic log cleared");
  }

  useEffect(() => {
    return () => {
      const device = deviceRef.current;

      if (device) {
        device.removeEventListener(
          "gattserverdisconnected",
          handleDisconnect
        );
      }
    };
  }, [handleDisconnect]);

  const connected = Boolean(serverRef.current?.connected);

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">BLUETOOTH DIAGNOSTICS</p>
        <h1>TB-21 Controller</h1>
        <p>JieLi RCSP discovery and volume-control prototype</p>
      </header>

      <section className="panel">
        <div className="status-row">
          <span
            className={`status-dot ${connected ? "online" : ""}`}
          />
          <strong>{status}</strong>
        </div>

        <p className="muted">
          Device: {deviceName || "Not selected"}
        </p>

        <p className="muted">
          Secure context: {String(window.isSecureContext)}
        </p>

        <div className="button-row">
          <button onClick={scanAndConnect} disabled={busy}>
            {busy ? "Connecting…" : "Scan & Connect"}
          </button>

          <button
            className="secondary"
            onClick={disconnect}
            disabled={!deviceRef.current}
          >
            Disconnect
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Master Volume</h2>
          <span className="volume-value">
            {volume} / {maxVolume}
          </span>
        </div>

        <div className="volume-controls">
          <button
            className="volume-button"
            onClick={() => changeVolume(-1)}
            disabled={!connected || volume <= 0}
          >
            −
            <span>Volume down</span>
          </button>

          <button
            className="volume-button"
            onClick={() => changeVolume(1)}
            disabled={!connected || volume >= maxVolume}
          >
            +
            <span>Volume up</span>
          </button>
        </div>

        <p className="muted">{commandStatus}</p>
        <p className="warning">
          Volume commands are not transmitted until the complete RCSP
          protocol is implemented and verified.
        </p>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>GATT Services</h2>
          <span className="count">{services.length}</span>
        </div>

        {services.length === 0 ? (
          <p className="muted">
            Connect to inspect available services.
          </p>
        ) : (
          services.map((service) => (
            <article className="service" key={service.uuid}>
              <strong className="uuid">{service.uuid}</strong>

              {service.characteristics.map((ch) => (
                <div className="characteristic" key={ch.uuid}>
                  <code>{ch.uuid}</code>

                  <div className="property-list">
                    {Object.entries(ch.properties)
                      .filter(([, enabled]) => enabled)
                      .map(([name]) => (
                        <span className="property" key={name}>
                          {name}
                        </span>
                      ))}
                  </div>

                  {ch.properties.read && (
                    <button
                      className="secondary small"
                      onClick={() =>
                        readCharacteristic(service.uuid, ch.uuid)
                      }
                    >
                      Read value
                    </button>
                  )}
                </div>
              ))}
            </article>
          ))
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Console Log</h2>
          <button
            className="secondary small"
            onClick={clearLogs}
          >
            Clear
          </button>
        </div>

        <div className="log-list">
          {logs.length === 0 ? (
            <p className="muted">No events yet.</p>
          ) : (
            [...logs].reverse().map((entry) => (
              <article className="log-entry" key={entry.id}>
                <time>{entry.time}</time>
                <strong>{entry.message}</strong>
                {entry.details && (
                  <pre>{entry.details}</pre>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      <footer className="footer">
        Use HTTPS on Android Chrome. Keep PiLink disconnected while
        testing the browser connection.
      </footer>
    </main>
  );
}

